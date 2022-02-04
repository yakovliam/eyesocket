import {User} from "object/user";

export class UserHandshakePacket {

    // the user
    private readonly _user: User;

    // constructor
    constructor(user: User) {
        this._user = user;
    }

    get user(): User {
        return this._user;
    }
}