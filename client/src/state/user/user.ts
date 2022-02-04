export class User {

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