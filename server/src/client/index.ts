import {User} from "../object/user";
import {Socket} from "socket.io";
import {Room} from "../object/server/room";

export class Client {

    // user
    private _user: User;

    // socket
    private _socket: Socket;

    // rooms that the user is in
    private _rooms: Array<Room>;

    // client
    constructor(user: User, socket: Socket, rooms: Array<Room>) {
        this._user = user;
        this._socket = socket;
        this._rooms = rooms;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get socket(): Socket {
        return this._socket;
    }

    set socket(value: Socket) {
        this._socket = value;
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }

    set rooms(value: Array<Room>) {
        this._rooms = value;
    }
}