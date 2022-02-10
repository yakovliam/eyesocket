import express from "express";
import {Socket} from "socket.io";
import indexRouter from "./routes/index";
import * as http from "http";
import {Server} from "socket.io";
import clientManager from "./client/client-manager";
import {Client} from "./client";
import cors from "cors";
import {SocketEventRegistry} from "@common/types/socket/registry";
import {UserHandshakePacket} from "@common/types/socket/handshake";
import {
    ClientJoinRoomEvent,
    ClientLeaveRoomEvent,
    ClientMessageEvent,
    ServerMessageEvent
} from "@common/types/socket/event";
import {callJoinRoomHooks, callMessageHooks} from "./hooks/bot-hooks";
import {SystemMessage} from "@common/types/message";
import {Room} from "@common/types/server/room";
import helmet from "helmet";
import {GeneralBot} from "./bots/general-bot";
import dotenv from "dotenv";

dotenv.config();

const index = express();
const server = http.createServer(index);

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: false
    }
});

const corsOptions = {
    origin: '*',
};

index.use(cors(corsOptions));

// helmet
index.use(helmet());

// router
index.use('/', indexRouter);

io.on('connection', (socket: Socket) => {
    // when a client connects

    // on disconnection
    socket.on("disconnect", () => {
        // get client
        const client: Client = clientManager.clients.find(c => c.socket === socket);

        // get all rooms that the client is currently in and send a disconnect/leave message
        const applicableRooms: Array<Room> = client.rooms;
        applicableRooms.forEach(room => {
            const roomLeaveMessage: SystemMessage = {
                type: "system",
                content: String(client.user.username + " left " + (room.name ? room.name : room.handle))
            }

            const roomLeaveMessageEvent: ServerMessageEvent = {
                isGlobal: false,
                room: room,
                message: roomLeaveMessage
            }

            // emit leave room message
            io.to(room.handle).emit("message", roomLeaveMessageEvent);
        });

        // disconnect (make sure)
        client.socket.disconnect();

        const updated = clientManager.clients.filter(c => c.user.uuid !== client.user.uuid);

        // remove client from clients manager
        clientManager.updateClients(updated);
    });

    // on user handshake
    socket.on(SocketEventRegistry.USER_HANDSHAKE, (handshake: UserHandshakePacket) => {
        const userHandshakePacket: UserHandshakePacket = handshake as UserHandshakePacket;

        // add user to client manager
        if (clientManager.clients.some(c => c.user === userHandshakePacket.user)) {
            return;
        }

        clientManager.clients.push(new Client(userHandshakePacket.user, socket, []));
    });

    // on message
    socket.on(SocketEventRegistry.MESSAGE, (message: any) => {
        // if the user's message isn't a user message
        if (message?.message?.type !== "user") {
            // user tried to send a fraudulent message
            return;
        }

        const clientMessageEvent: ClientMessageEvent = message as ClientMessageEvent;

        // create server message event
        const serverMessageEvent: ServerMessageEvent = {
            isGlobal: false,
            message: clientMessageEvent.message,
            room: clientMessageEvent.room
        };

        // broadcast message to all in the designated room
        io.to(clientMessageEvent.room.handle).emit("message", serverMessageEvent);

        callMessageHooks(io, socket, clientMessageEvent);
    });

    // on join room
    socket.on(SocketEventRegistry.JOIN_ROOM, (event: ClientJoinRoomEvent) => {
        const clientJoinRoomEvent: ClientJoinRoomEvent = event as ClientJoinRoomEvent;

        // get client
        const client = clientManager.getClient(socket);

        if (!client) {
            return;
        }

        if (client.rooms.includes(clientJoinRoomEvent.room)) {
            return;
        }

        // add client to room
        client.rooms.push(clientJoinRoomEvent.room);
        clientManager.updateClient(client);
        socket.join(clientJoinRoomEvent.room.handle);

        // join room message
        const roomJoinMessage: SystemMessage = {
            type: "system",
            content: String(client.user.username + " joined " + (clientJoinRoomEvent.room.name ? clientJoinRoomEvent.room.name : clientJoinRoomEvent.room.handle))
        }

        const roomJoinMessageEvent: ServerMessageEvent = {
            isGlobal: false,
            room: clientJoinRoomEvent.room,
            message: roomJoinMessage
        }

        // emit join room message
        io.to(clientJoinRoomEvent.room.handle).emit("message", roomJoinMessageEvent);

        callJoinRoomHooks(io, socket, clientJoinRoomEvent);
    });

    // on leave room
    socket.on(SocketEventRegistry.LEAVE_ROOM, (event: ClientLeaveRoomEvent) => {
        const clientLeaveRoomEvent: ClientLeaveRoomEvent = event as ClientLeaveRoomEvent;

        // get client
        const client = clientManager.getClient(socket);

        if (!client) {
            return;
        }

        if (!client.rooms.some(c => c.handle === clientLeaveRoomEvent.room.handle)) {
            return;
        }

        // remove client from room
        client.rooms = client.rooms.filter(c => c.handle !== clientLeaveRoomEvent.room.handle);
        clientManager.updateClient(client);
        socket.leave(clientLeaveRoomEvent.room.handle);

        // leave room message
        const roomLeaveMessage: SystemMessage = {
            type: "system",
            content: String(client.user.username + " left " + (clientLeaveRoomEvent.room.name ? clientLeaveRoomEvent.room.name : clientLeaveRoomEvent.room.handle))
        }

        const roomLeaveMessageEvent: ServerMessageEvent = {
            isGlobal: false,
            room: clientLeaveRoomEvent.room,
            message: roomLeaveMessage
        }

        // emit leave room message
        io.to(clientLeaveRoomEvent.room.handle).emit("message", roomLeaveMessageEvent);
    });
});

new GeneralBot();

server.listen(process.env.PORT, () => {
    console.log('listening on *:' + process.env.PORT);
});
