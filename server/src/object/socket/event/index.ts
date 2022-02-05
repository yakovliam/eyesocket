import {Room} from "../../server/room";
import {ContentedMessage} from "../../message";

export class ServerMessageEvent {

    /*
     * if the message is a global server message, not just
     * a room message
     */
    private _isGlobal: boolean;

    /*
     * room that the message was sent to. set to undefined
     * if the message is global
     */
    private _room: Room | undefined;

    /*
     * message itself. contented messages can be very
     * complex
     */
    private _message: ContentedMessage;

    // constructor
    constructor(isGlobal: boolean, room: Room | undefined, message: ContentedMessage) {
        this._isGlobal = isGlobal;
        this._room = room;
        this._message = message;
    }

    get isGlobal(): boolean {
        return this._isGlobal;
    }

    set isGlobal(value: boolean) {
        this._isGlobal = value;
    }

    get room(): Room | undefined {
        return this._room;
    }

    set room(value: Room | undefined) {
        this._room = value;
    }

    get message(): ContentedMessage {
        return this._message;
    }

    set message(value: ContentedMessage) {
        this._message = value;
    }
}


export class ClientMessageEvent {

    /*
     * room that the message was sent to.
     */
    private _room: Room;

    /*
     * message itself. contented messages can be very
     * complex
     */
    private _message: ContentedMessage;

    // constructor
    constructor(room: Room, message: ContentedMessage) {
        this._room = room;
        this._message = message;
    }

    get room(): Room {
        return this._room;
    }

    set room(value: Room) {
        this._room = value;
    }

    get message(): ContentedMessage {
        return this._message;
    }

    set message(value: ContentedMessage) {
        this._message = value;
    }
}

export class ClientJoinRoomEvent {

    /*
    * room that the client is joining
    */
    private readonly _room: Room;

    // constructor
    constructor(room: Room) {
        this._room = room;
    }

    get room(): Room {
        return this._room;
    }
}

export class ClientLeaveRoomEvent {

    /*
    * room that the client is leaving
    */
    private readonly _room: Room;

    // constructor
    constructor(room: Room) {
        this._room = room;
    }

    get room(): Room {
        return this._room;
    }
}