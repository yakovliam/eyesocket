import {io, Socket} from "socket.io-client";
import {dispatch} from "use-bus";
import {Message, SystemMessage} from "../message";
import {v4} from "uuid";

export class Room {

    // user's username
    private _username: string;

    // host of the room
    private _host: string;

    // socket
    private _socket: Socket | undefined;

    // constructor
    constructor(username: string, host: string) {
        this._username = username;
        this._host = host;
        this._socket = undefined;
    }

    public connect() {
        if (this._socket) {
            this._socket.disconnect();
        }

        // connect to room
        this._socket = io(this._host, {withCredentials: false});
        this.registerEvents();
    }

    public disconnect() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = undefined;
        }
    }

    public isConnected() {
        return this._socket ? this._socket.connected : false;
    }

    public registerEvents() {
        if (!this._socket) {
            return;
        }

        this._socket.on("connect_error", () => {
            // todo pretty toast popup
            dispatch({
                type: '@@ROOM/MESSAGE_RECEIVE',
                payload: new SystemMessage(v4(), new Date(), "Error connecting. Retrying...")
            });
        });

        this._socket.on("disconnect", () => {
            // emit to server
            this._socket.emit("disconnect-alert", {username: this._username});
            // todo pretty toast popup
            dispatch({
                type: '@@ROOM/MESSAGE_RECEIVE',
                payload: new SystemMessage(v4(), new Date(), "You've been disconnected. Retrying...")
            });
        });


        this._socket.on("connect", () => {
            // emit to server
            if (!this._socket) {
                // todo pretty toast
                alert("You're not connected to a room!");
                return;
            }

            this._socket.emit("connect-alert", {username: this._username});
        });

        this._socket.on("system-message", (...args) => {
            const messageObject = args[0];
            const message: Message = new SystemMessage(messageObject._messageUUID, messageObject._timestamp, messageObject._message);
            // use bus to emit
            dispatch({type: '@@ROOM/CONNECT', payload: message});
        });

        this._socket.on("message", (...args) => {
            const messageObject = args[0];
            const message: Message = new Message(messageObject._messageUUID, messageObject._timestamp, messageObject._username, messageObject._message);
            // use bus to emit
            dispatch({type: '@@ROOM/MESSAGE_RECEIVE', payload: message});
        });
    }

    public sendMessage(message: string) {
        // emit through socket
        if (!this._socket) {
            // todo pretty toast
            alert("You're not connected to a room!");
            return;
        }

        this._socket.emit("message", {message: message, username: this._username});
    }

    set username(value: string) {
        this._username = value;
    }

    set host(value: string) {
        this._host = value;
    }
}
