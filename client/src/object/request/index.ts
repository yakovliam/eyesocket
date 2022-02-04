import {Room} from "object/server/room";

export class ServerPingResponse {

    // if the server is online
    private readonly _online: boolean;

    // rooms list that the server responds with
    private readonly _rooms: Array<Room>;

    // constructor
    constructor(online: boolean, rooms: Array<Room>) {
        this._online = online;
        this._rooms = rooms;
    }

    get online(): boolean {
        return this._online;
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }
}