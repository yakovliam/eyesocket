import clientManager from "../client/client-manager";
import {Room} from "common/types/server/room";

class RoomManager {

    // rooms
    private _rooms: Array<Room>;

    // constructor
    constructor(rooms: Array<Room>) {
        this._rooms = rooms;
    }

    public addRoom(room: Room) {
        if (this._rooms.includes(room)) {
            return;
        }

        // add
        this._rooms.push(room);

        // todo implement protocol through sockets to tell clients to ask for a new server rooms list/ping packet
    }

    public removeRoom(room: Room) {
        if (!this._rooms.includes(room)) {
            return;
        }

        // remove
        this._rooms = this._rooms.filter(r => r !== room);

        // remove all clients from that room
        clientManager.clients.forEach(client => {
            if (client.rooms.includes(room)) {
                // leave from socket
                client.socket.leave(room.handle);
                // leave programmatically
                client.rooms = client.rooms.filter(r => r.handle !== room.handle);

                // todo implement some kind of event telling the client that this room was deleted
            }
        })

        // todo implement protocol through sockets to tell clients to ask for a new server rooms list/ping packet
    }

    get rooms(): Array<Room> {
        return this._rooms;
    }
}

const r1: Room = {handle: "main1", name: "Main Room 1"};
const r2: Room = {handle: "main2", name: "Main Room 2"};


const rooms: Array<Room> = new Array<Room>();
rooms.push(r1);
rooms.push(r2);

// create room manager
const roomManager: RoomManager = new RoomManager(rooms);

// export
export default roomManager;
