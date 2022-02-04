export class Room {

    // room name
    private _name: string;

    // room custom handle
    private _handle: string;

    // constructor
    constructor(name: string, handle: string) {
        this._name = name;
        this._handle = handle;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get handle(): string {
        return this._handle;
    }

    set handle(value: string) {
        this._handle = value;
    }
}