import {atom} from "recoil";
import {DEFAULT_USER} from "common/types/user/index";
import {DEFAULT_ROOM} from "common/types/server/room/index";

export const userState = atom({
    key: 'userState',
    default: DEFAULT_USER
});

export const currentRoomState = atom({
    key: "currentRoomState",
    default: DEFAULT_ROOM
});