import {Room} from "../../server/room";
import {ContentedMessage} from "../../message";

export type ServerMessageEvent = {

    /*
     * if the message is a global server message, not just
     * a room message
     */
    isGlobal: boolean;

    /*
     * room that the message was sent to. set to undefined
     * if the message is global
     */
    room: Room | undefined;

    /*
     * message itself. contented messages can be very
     * complex
     */
    message: ContentedMessage;
}


export type ClientMessageEvent = {

    /*
     * room that the message was sent to.
     */
    room: Room;

    /*
     * message itself. contented messages can be very
     * complex
     */
    message: ContentedMessage;
}

export type ClientJoinRoomEvent = {

    /*
    * room that the client is joining
    */
    room: Room;
}

export type ClientLeaveRoomEvent = {

    /*
    * room that the client is leaving
    */
    room: Room;
}