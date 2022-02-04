import {Server} from "object/server";
import {io, Socket, SocketOptions} from "socket.io-client";
import {ManagerOptions} from "socket.io-client/build/esm/manager";
import {User} from "object/user";
import {SocketEventRegistry} from "./registry";
import {UserHandshakePacket} from "./handshake";
import {dispatch} from "use-bus";
import {BusEventRegistry} from "object/bus/registry";
import {ClientMessageEvent, ServerMessageEvent} from "./event";

export class SocketManager {

    private static IO_OPTIONS: Partial<ManagerOptions & SocketOptions> = {withCredentials: false, reconnection: false};

    // servers that are currently connected
    private connectedServers: Map<Server, Socket>;


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
        this.connectedServers = new Map<Server, Socket>();
        this.user = user;
    }

    public connectToServer(server: Server) {
        // if already in connected servers, disconnect and reconnect
        if (this.connectedServers.has(server)) {
            // disconnect
            this.disconnectFromServer(server);
            // reconnect to server
            const socket = io(server.host, SocketManager.IO_OPTIONS);

            // register events
            this.registerServerEvents(server, socket);

            // add to map
            this.connectedServers.set(server, socket);
        }
    }

    public disconnectFromServer(server: Server) {
        if (this.connectedServers.has(server)) {
            this.connectedServers.get(server)?.disconnect();
            // remove from map
            this.connectedServers.delete(server);
        }
    }

    private registerServerEvents(server: Server, socket: Socket) {
        // on disconnect or disconnect error, immediately remove from the map
        socket.on("connect_error", () => {
            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_CONNECTION_FAILURE, payload: server})

            this.connectedServers.delete(server)
        });

        socket.on("disconnect", () => {
            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_CONNECTION_FAILURE, payload: server})

            this.connectedServers.delete(server)
        });

        // on connection, send user handshake
        socket.on("connect", () => {
            socket.emit(SocketEventRegistry.USER_HANDSHAKE, new UserHandshakePacket(this.user));
        });

        // on message
        socket.on("message", (serverMessage) => {
            // construct server message event
            const serverMessageEvent: ServerMessageEvent = serverMessage as ServerMessageEvent;

            // dispatch via use-bus
            dispatch({type: BusEventRegistry.SERVER_MESSAGE_EVENT, payload: serverMessageEvent})
        });
    }

    private sendMessage(server: Server, clientMessageEvent: ClientMessageEvent) {
        if (!this.connectedServers.has(server)) {
            return;
        }

        // get socket
        const serverSocket = this.connectedServers.get(server);

        if (serverSocket === undefined || !serverSocket.connected) {
            return;
        }

        // emit to the server
        serverSocket.emit("message", clientMessageEvent);
    }

    public isConnected(server: Server) {
        return this.connectedServers.has(server) && this.connectedServers.get(server)?.connected;
    }
}