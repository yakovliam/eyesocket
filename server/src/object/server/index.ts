import {Room} from "./room";
import {OnlineState} from "./online-state";

export class Server {

    // server host
    private _host: string;

    // server name
    private _name: string;

    // if the server is online or not or checking
    private _onlineState: OnlineState;

    // server rooms
    private _rooms: Array<Room>;

    // constructor
    constructor(host: string, name: string, onlineState: OnlineState, rooms: Array<Room>) {
        this._host = host;
        this._name = name;
        this._onlineState = onlineState;
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

    get onlineState(): OnlineState {
        return this._onlineState;
    }

    set onlineState(value: OnlineState) {
        this._onlineState = value;
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }

    set rooms(value: Array<Room>) {
        this._rooms = value;
    }
}