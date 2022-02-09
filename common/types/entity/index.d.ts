import { Room } from "../server/room/index";
export declare const DEFAULT_USER: User;
export declare type User = {
    username: string;
    uuid: string;
    room: Room | undefined;
};
