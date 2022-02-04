import {v4} from "uuid";

export class User {

    public static ANON: User = new User("user-" + Math.random() * (99999 - 10000) + 10000, v4())

    // username
    private _username: string;

    // uuid
    private readonly _uuid: string;

    // constructor
    constructor(username: string, uuid: string) {
        this._username = username;
        this._uuid = uuid;
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
}