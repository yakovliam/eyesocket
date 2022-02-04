export class Message {

    // message uuid
    private readonly _messageUUID: string;

    // timestamp
    private readonly _timestamp: Date;

    // username
    private readonly _username: string;

    // message
    private readonly _message: string;

    // constructor
    constructor(messageUUID: string, timestamp: Date, username: string, message: string) {
        this._messageUUID = messageUUID;
        this._timestamp = timestamp;
        this._username = username;
        this._message = message;
    }


    get messageUUID(): string {
        return this._messageUUID;
    }

    get timestamp(): Date {
        return this._timestamp;
    }

    get username(): string {
        return this._username;
    }

    get message(): string {
        return this._message;
    }
}

export class SystemMessage extends Message {

    constructor(messageUUID: string, timestamp: Date, message: string) {
        super(messageUUID, timestamp, "System", message);
    }
}
