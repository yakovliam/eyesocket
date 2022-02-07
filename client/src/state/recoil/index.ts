import {atom} from "recoil";
import {DEFAULT_USER} from "common/types/user/index";
import {DEFAULT_ROOM} from "common/types/server/room/index";
import {DEFAULT_SERVER} from "common/types/server";
import {ServerManager} from "objects/server/servermanager";

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
   default: new ServerManager([])
});