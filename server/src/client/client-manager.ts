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

    public updateClient(client: Client) {
        let clients: Array<Client> = new Array<Client>(...this._clients);
        clients = clients.filter(c => c.user.uuid !== client.user.uuid);
        clients.push(client);
        this._clients = clients;
    }

    public updateClients(clients: Array<Client>) {
        this._clients = clients;
    }
}

const clientManager: ClientManager = new ClientManager([]);

export default clientManager;