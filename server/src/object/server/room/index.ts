export class Room {

    // room handle
    private _handle: string;

    // custom room name
    private _name: string;

    // constructor
    constructor(handle: string, name: string) {
        this._handle = handle;
        this._name = name;
    }

    get handle(): string {
        return this._handle;
    }

    set handle(value: string) {
        this._handle = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}