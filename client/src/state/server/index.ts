import {Room} from "./room";

export class Server {

    // server host
    private _host: string;

    // server name
    private _name: string;

    // server rooms
    private _rooms: Array<Room>;

    // constructor
    constructor(host: string, name: string, rooms: Array<Room>) {
        this._host = host;
        this._name = name;
        this._rooms = rooms;
    }

    get host(): string {
        return this._host;
    }

    set host(value: string) {
        this._host = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }

    set rooms(value: Array<Room>) {
        this._rooms = value;
    }
}