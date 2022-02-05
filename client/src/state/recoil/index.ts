import {atom} from "recoil";
import {User} from "object/user";
import {Room} from "object/server/room";

export const userState = atom({
    key: 'userState',
    default: User.ANON
});

export const currentRoomState = atom({
    key: "currentRoomState",
    default: new Room("", "")
});