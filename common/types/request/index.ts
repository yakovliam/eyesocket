import {Room} from "../server/room";

export type ServerPingResponse = {

    // if the server is online
    online: boolean;

    // a preferred name to use
    name: string;

    // rooms list that the server responds with
    rooms: Array<Room>;
}