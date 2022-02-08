import {Server} from "common/types/server";

export const DEFAULT_SERVER_MANAGER: ServerManager = {servers: []};

export type ServerManager = {
    // servers
    servers: Array<Server>;
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