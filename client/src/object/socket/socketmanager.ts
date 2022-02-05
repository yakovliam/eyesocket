import {Server} from "object/server";
import {io, Socket, SocketOptions} from "socket.io-client";
import {ManagerOptions} from "socket.io-client/build/esm/manager";
import {User} from "object/user";
import {SocketEventRegistry} from "./registry";
import {UserHandshakePacket} from "./handshake";
import {dispatch} from "use-bus";
import {BusEventRegistry} from "object/bus/registry";
import {ClientJoinRoomEvent, ClientLeaveRoomEvent, ClientMessageEvent, ServerMessageEvent} from "./event";
import {Room} from "object/server/room";
import {useState} from "react";

class SocketManager {

    private static IO_OPTIONS: Partial<ManagerOptions & SocketOptions> = {withCredentials: false, reconnection: false};

    // servers that are currently connected
    // <host, socket>
    private connectedServers: Map<string, Socket>;

    /*
     * current user
     *
     * this paradigm forces the idea of global user-connection state, so that someone needs to
     * completely restart and rejoin servers in order to gain a new identity. this prevents people
     * from switching very quickly between users in order to avoid requests from the server. this idea still
     * encapsulates security and anonymity, but it also makes it easier programmatically for the server to keep
     * up with user events being fired at it
     */
    private readonly user: User;

    constructor(user: User) {
        this.connectedServers = new Map<string, Socket>();
        this.user = user;
    }

    public connectToServer(server: Server) {
        // if already in connected servers, disconnect and reconnect
        if (this.connectedServers.has(server.host)) {
            // disconnect
            this.disconnectFromServer(server);
        }

        // reconnect to server
        const socket = io(server.host, SocketManager.IO_OPTIONS);

        // register events
        this.registerServerEvents(server, socket);

        // add to map
        this.connectedServers.set(server.host, socket);
    }

    public disconnectFromServer(server: Server) {
        if (this.connectedServers.has(server.host)) {
            this.connectedServers.get(server.host)?.disconnect();
            // remove from map
            this.connectedServers.delete(server.host);
        }
    }

    private registerServerEvents(server: Server, socket: Socket) {
        // on disconnect or disconnect error, immediately remove from the map
        socket.on("connect_error", () => {
            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_CONNECTION_FAILURE, payload: server})

            this.disconnectFromServer(server);
        });

        socket.on("disconnect", () => {
            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_CONNECTION_FAILURE, payload: server})

            this.disconnectFromServer(server);
        });

        // on connection, send user handshake
        socket.on("connect", () => {
            socket.emit(SocketEventRegistry.USER_HANDSHAKE, new UserHandshakePacket(this.user));
        });

        // on message
        socket.on(SocketEventRegistry.MESSAGE, (serverMessage) => {
            // construct server message event
            const serverMessageEvent: ServerMessageEvent = serverMessage as ServerMessageEvent;

            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_MESSAGE_EVENT, payload: serverMessageEvent})
        });
    }

    public sendMessage(server: Server, clientMessageEvent: ClientMessageEvent) {
        if (!this.connectedServers.has(server.host)) {
            return;
        }

        // get socket
        const serverSocket = this.connectedServers.get(server.host);

        if (serverSocket === undefined || !serverSocket.connected) {
            return;
        }

        // emit to the server
        serverSocket.emit(SocketEventRegistry.MESSAGE, clientMessageEvent);
    }

    public joinRoom(server: Server, room: Room) {
        if (!this.connectedServers.has(server.host)) {
            return;
        }

        // get socket
        const serverSocket = this.connectedServers.get(server.host);

        if (serverSocket === undefined || !serverSocket.connected) {
            return;
        }

        // emit to the server
        serverSocket.emit(SocketEventRegistry.JOIN_ROOM, new ClientJoinRoomEvent(room));
    }

    public leaveRoom(server: Server, room: Room) {
        if (!this.connectedServers.has(server.host)) {
            return;
        }

        // get socket
        const serverSocket = this.connectedServers.get(server.host);

        if (serverSocket === undefined || !serverSocket.connected) {
            return;
        }

        // emit to the server
        serverSocket.emit(SocketEventRegistry.LEAVE_ROOM, new ClientLeaveRoomEvent(room));
    }

    public isConnected(server: Server) {
        return this.connectedServers.has(server.host) && this.connectedServers.get(server.host)?.connected;
    }

    public disconnectFromAll() {
        this.connectedServers.forEach(s => {
            s.disconnect();
        })
    }
}

const initSocketManager: SocketManager = new SocketManager(User.ANON);

export const useSocketManager = () => {
    const [socketManager, setSocketManager] = useState(initSocketManager);

    const restartSocketManager = (user: User) => {
        socketManager.disconnectFromAll();
        setSocketManager(new SocketManager(user));
    }

    return [socketManager, setSocketManager, restartSocketManager] as const;
};