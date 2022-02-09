import {Room} from "../server/room/index";
import {v4} from "uuid";

export const DEFAULT_USER: UserEntity = {type: "user", username: "user-" + Math.random() * (99999 - 10000) + 10000, uuid: v4(), room: undefined};

export type Entity = {
    type: string;

    // username
    username: string;

    // uuid
    uuid: string;
}

export type BotEntity = Entity & {
    type: "bot";

    // username
    username: string;

    // uuid
    uuid: string;
}

export type UserEntity = Entity & {
    type: "user";

    // username
    username: string;

    // uuid
    uuid: string;

    // the current room the user is in
    // only present on the client side, not the server side
    room: Room | undefined;
}
