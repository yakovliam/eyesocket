import {atom} from "recoil";
import {DEFAULT_USER} from "common/types/entity";
import {DEFAULT_ROOM} from "common/types/server/room/index";
import {DEFAULT_SERVER} from "common/types/server";
import {DEFAULT_SERVER_MANAGER} from "objects/server/servermanager";
import {DEFAULT_SOCKET_MANAGER} from "objects/socket/socketmanager";
import {DEFAULT_TOASTER_STATE} from "objects/toaster";

export const userState = atom({
    key: 'userState',
    default: DEFAULT_USER
});

export const currentRoomState = atom({
    key: "currentRoomState",
    default: DEFAULT_ROOM
});

export const currentServerState = atom({
    key: "currentServerState",
    default: DEFAULT_SERVER
});

export const serverManagerState = atom({
    key: "serverManagerState",
    default: DEFAULT_SERVER_MANAGER
});

export const socketManagerState = atom({
   key: "socketManagerState",
   default: DEFAULT_SOCKET_MANAGER
});

export const toasterState = atom({
    key: "toasterState",
    default: DEFAULT_TOASTER_STATE
})