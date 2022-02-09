import {Socket} from "socket.io";
import {UserEntity} from "common/../../../common/types/entity";
import {Room} from "common/types/server/room";


export class Client {

    // user
    private _user: UserEntity;

    // socket
    private _socket: Socket;

    // rooms that the user is in
    private _rooms: Array<Room>;

    // client
    constructor(user: UserEntity, socket: Socket, rooms: Array<Room>) {
        this._user = user;
        this._socket = socket;
        this._rooms = rooms;
    }

    get user(): UserEntity {
        return this._user;
    }

    set user(value: UserEntity) {
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