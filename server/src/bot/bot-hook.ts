import {Server, Socket} from "socket.io";
import {ClientJoinRoomEvent, ClientMessageEvent} from "../../../common/types/socket/event";

const messageHooks: Array<(io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => void> = [];

export const registerMessageHook = (callback: (io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => void) => {
    messageHooks.push(callback);
}

export const callMessageHooks = (io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => {
    messageHooks.forEach(callback => {
        callback(io, socket, clientMessageEvent);
    });
}

const joinRoomHooks: Array<(io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => void> = [];

export const registerJoinRoomHooks = (callback: (io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => void) => {
    joinRoomHooks.push(callback);
}

export const callJoinRoomHooks = (io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => {
    joinRoomHooks.forEach(callback => {
        callback(io, socket, clientJoinRoomEvent);
    });
}