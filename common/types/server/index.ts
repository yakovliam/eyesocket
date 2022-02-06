import {Room} from "./room";
import {OnlineState} from "./online-state";

export type Server = {

    // server host
    host: string;

    // server name
    name: string;

    // if the server is online or not or checking
    onlineState: OnlineState;

    // server rooms
    rooms: Array<Room>;
}