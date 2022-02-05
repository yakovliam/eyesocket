import {ClientJoinRoomEvent, ClientLeaveRoomEvent, ClientMessageEvent} from "../object/socket/event";
import {Room} from "../object/server/room";
import {ContentedMessage} from "../object/message";

export const parseClientJoinRoomEvent = (event: any) => {
    const room: Room = new Room(event._room._handle, event._room._name);
    return new ClientJoinRoomEvent(room);
}

export const parseClientLeaveRoomEvent = (event: any) => {
    const room: Room = new Room(event._room._handle, event._room._name);
    return new ClientLeaveRoomEvent(room);
}

export const parseClientMessage = (event: any) => {
    const room: Room = new Room(event._room._handle, event._room._name);
    const message: ContentedMessage = new ContentedMessage();

    return new ClientMessageEvent(room, message);
}