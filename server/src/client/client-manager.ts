import {Client} from "./index";
import {Socket} from "socket.io";

class ClientManager {

    // clients
    private _clients: Array<Client>;

    // constructor
    constructor(clients: Array<Client>) {
        this._clients = clients;
    }

    get clients(): Array<Client> {
        return this._clients;
    }

    set clients(value: Array<Client>) {
        this._clients = value;
    }

    public getClient(socket: Socket) {
        return this._clients.find(c => c.socket === socket);
    }
}

const clientManager: ClientManager = new ClientManager([]);

export default clientManager;