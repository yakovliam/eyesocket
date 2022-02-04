import {Server} from "./index";

export class ServerManager {

    // servers
    private _servers: Array<Server>;

    // constructor
    constructor(servers: Array<Server>) {
        this._servers = servers;
    }

    get servers(): Array<Server> {
        return this._servers;
    }

    set servers(value: Array<Server>) {
        this._servers = value;
    }
}