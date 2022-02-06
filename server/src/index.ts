import express from "express";
import {Socket} from "socket.io";
import indexRouter from "./routes/index";
import * as http from "http";
import {Server} from "socket.io";
import clientManager from "./client/client-manager";
import {Client} from "./client";
import cors from "cors";
import {SocketEventRegistry} from "../../common/types/socket/registry";
import {UserHandshakePacket} from "../../common/types/socket/handshake";
import {ClientJoinRoomEvent, ClientLeaveRoomEvent, ClientMessageEvent} from "../../common/types/socket/event";

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

// router
index.use('/', indexRouter);

io.on('connection', (socket: Socket) => {
    // when a client connects

    // on disconnection
    socket.on("disconnect", () => {
        // get client
        const client: Client = clientManager.clients.find(c => c.socket === socket);

        // remove client from clients manager
        clientManager.clients = clientManager.clients.filter(c => c !== client);
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
    socket.on(SocketEventRegistry.MESSAGE, (message: ClientMessageEvent) => {
        const clientMessageEvent: ClientMessageEvent = message as ClientMessageEvent;

        // broadcast message to all in the designated room
        io.to(clientMessageEvent.room.handle).emit("message", clientMessageEvent);
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
        socket.join(clientJoinRoomEvent.room.handle);
    });

    // on leave room
    socket.on(SocketEventRegistry.LEAVE_ROOM, (event: ClientLeaveRoomEvent) => {
        const clientLeaveRoomEvent: ClientLeaveRoomEvent = event as ClientLeaveRoomEvent;

        // get client
        const client = clientManager.getClient(socket);

        if (!client) {
            return;
        }

        if (!client.rooms.includes(clientLeaveRoomEvent.room)) {
            return;
        }

        // add client to room
        client.rooms.push(clientLeaveRoomEvent.room);
        socket.leave(clientLeaveRoomEvent.room.handle);
    });

});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
