import {useState} from "react";
import {Server} from "common/types/server";

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

// const initServerManager: ServerManager = new ServerManager([]);
//
// export const useServerManager = () => {
//     const [serverManager, setServerManager] = useState(initServerManager);
//
//     let updateServers = (servers: Array<Server>) => {
//         setServerManager(new ServerManager(servers));
//     };
//
//     return [serverManager, setServerManager, updateServers] as const;
// };