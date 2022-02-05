import {v4} from "uuid";
import {Room} from "object/server/room";

export class User {

    public static ANON: User = new User("user-" + Math.random() * (99999 - 10000) + 10000, v4(), undefined);

    // username
    private _username: string;

    // uuid
    private readonly _uuid: string;

    // the current room the player is in
    private _room: Room | undefined;

    // constructor
    constructor(username: string, uuid: string, room: Room | undefined) {
        this._username = username;
        this._uuid = uuid;
        this._room = room;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get uuid(): string {
        return this._uuid;
    }

    get room(): Room | undefined {
        return this._room;
    }

    set room(value: Room | undefined) {
        this._room = value;
    }
}