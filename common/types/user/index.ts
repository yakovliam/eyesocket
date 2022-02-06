import {Room} from "../server/room";
import {v4} from "uuid";

export const DEFAULT_USER: User = {username: "user-" + Math.random() * (99999 - 10000) + 10000, uuid: v4(), room: undefined};

export type User = {
    // username
    username: string;

    // uuid
    uuid: string;

    // the current room the player is in
    room: Room | undefined;
}