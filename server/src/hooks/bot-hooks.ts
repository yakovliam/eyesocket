import {Server, Socket} from "socket.io";
import {ClientJoinRoomEvent, ClientLeaveRoomEvent, ClientMessageEvent} from "@common/types/socket/event";
import {UserHandshakePacket} from "@common/types/socket/handshake";

// MESSAGE
const messageHooks: Array<(io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => void> = [];

export const registerMessageHook = (callback: (io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => void) => {
    messageHooks.push(callback);
}

export const callMessageHooks = (io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent) => {
    messageHooks.forEach(callback => {
        callback(io, socket, clientMessageEvent);
    });
}

// JOIN ROOM
const joinRoomHooks: Array<(io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => void> = [];

export const registerJoinRoomHooks = (callback: (io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => void) => {
    joinRoomHooks.push(callback);
}

export const callJoinRoomHooks = (io: Server, socket: Socket, clientJoinRoomEvent: ClientJoinRoomEvent) => {
    joinRoomHooks.forEach(callback => {
        callback(io, socket, clientJoinRoomEvent);
    });
}

// LEAVE ROOM
const leaveRoomHooks: Array<(io: Server, socket: Socket, clientLeaveRoomEvent: ClientLeaveRoomEvent) => void> = [];

export const registerLeaveRoomHooks = (callback: (io: Server, socket: Socket, clientLeaveRoomEvent: ClientLeaveRoomEvent) => void) => {
    leaveRoomHooks.push(callback);
}

export const callLeaveRoomHooks = (io: Server, socket: Socket, clientLeaveRoomEvent: ClientLeaveRoomEvent) => {
    leaveRoomHooks.forEach(callback => {
        callback(io, socket, clientLeaveRoomEvent);
    });
}

// HANDSHAKE
const handshakeHooks: Array<(io: Server, socket: Socket, userHandshakePacket: UserHandshakePacket) => void> = [];

export const registerHandshakeHooks = (callback: (io: Server, socket: Socket, userHandshakePacket: UserHandshakePacket) => void) => {
    handshakeHooks.push(callback);
}

export const callHandshakeHooks = (io: Server, socket: Socket, userHandshakePacket: UserHandshakePacket) => {
    handshakeHooks.forEach(callback => {
        callback(io, socket, userHandshakePacket);
    });
}