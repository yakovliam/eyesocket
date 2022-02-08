import { Room } from "../../server/room";
import { ContentedMessage } from "../../message";
export declare type ServerMessageEvent = {
    isGlobal: boolean;
    room: Room | undefined;
    message: ContentedMessage;
};
export declare type ClientMessageEvent = {
    room: Room;
    message: ContentedMessage;
};
export declare type ClientJoinRoomEvent = {
    room: Room;
};
export declare type ClientLeaveRoomEvent = {
    room: Room;
};
