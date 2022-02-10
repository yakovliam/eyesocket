import {Header, Box, TextInput, Button, Anchor} from "grommet";
import {Globe, Update} from "grommet-icons";
import React, {useCallback, useState} from "react";
import {useRecoilState} from "recoil";
import {
    currentRoomState,
    currentServerState,
    serverManagerState,
    socketManagerState, toasterState,
    userState
} from "state/recoil";
import {UserEntity} from "common/types/entity";
import {DEFAULT_ROOM, Room} from "common/types/server/room/index";
import {DEFAULT_SERVER, Server} from "common/types/server";
import {v4} from "uuid";
import {SocketManager} from "objects/socket/socketmanager";
import {OnlineState} from "common/types/server/online-state";
import {RequestRegistry} from "common/types/request/registry";
import {ServerPingResponse} from "common/types/request";

const HUB_SERVER_HOST: string = "https://es.yakovliam.com";
const HUB_SERVER_NAME: string = "Hub Server";

export function NavBar() {

    const [username, setUsername] = useState("");
    const [, setUser] = useRecoilState(userState);
    const [socketManager, setSocketManager] = useRecoilState(socketManagerState);
    const [serverManager, setServerManager] = useRecoilState(serverManagerState);
    const [, setCurrentRoom] = useRecoilState(currentRoomState);
    const [, setCurrentServer] = useRecoilState(currentServerState);
    const [, setToaster] = useRecoilState(toasterState);

    const updateServer = useCallback((oldServer: Server | undefined, newServer: Server) => {
        let servers: Array<Server> = new Array<Server>(...serverManager.servers);

        if (oldServer) {
            // remove old
            servers = servers.filter(el => el.host !== oldServer.host);
        }

        // add server
        servers.push(newServer);

        setServerManager({servers: servers});
    }, [setServerManager, serverManager]);

    const checkAndUpdateServerStatus = useCallback((host: string, server: Server) => {
        // fetch server host to see if its online
        fetch(host + "/" + RequestRegistry.SERVER_PING, {method: 'GET'}).then(r => {
            r.json().then(data => {
                // construct rooms
                const rooms: Array<Room> = data.rooms.map((room: any) => {
                    return room as Room;
                });

                // reconstruct server ping response objects
                const serverPingResponse: ServerPingResponse = {online: data.online, rooms: rooms, name: data.name};

                const newServer: Server = {
                    host: server.host,
                    name: server.name,
                    onlineState: serverPingResponse.online ? OnlineState.ONLINE : OnlineState.OFFLINE,
                    rooms: serverPingResponse.rooms
                };

                // re-add server to server manager, but now it has room info and with online info
                updateServer(server, newServer);

                // connect to server
                socketManager.connectToServer(server);

                // toaster
                setToaster({
                    status: "normal",
                    visible: true,
                    title: "You connected to " + (server.name ? server.name : server.host)
                });
            }).catch(e => {
                console.error(e);
            });
        }).catch(e => {
            const newServer: Server = {
                host: server.host,
                name: server.name,
                onlineState: OnlineState.OFFLINE,
                rooms: server.rooms
            };

            // re-add server to server manager, but now it's offline
            updateServer(server, newServer);
        });
    }, [socketManager, updateServer]);

    // add server
    const connectToHubServer = () => {
        // if the server is already in the server manager, don't do anything
        if (serverManager.servers.some(s => s.host === HUB_SERVER_HOST)) {
            return;
        }

        // add to server manager, but don't make it "online" yet
        const server: Server = {
            host: HUB_SERVER_HOST,
            name: HUB_SERVER_NAME,
            onlineState: OnlineState.CHECKING,
            rooms: []
        }

        updateServer(undefined, server);
        checkAndUpdateServerStatus(HUB_SERVER_HOST, server);
    }

    const updateUsername = () => {
        setCurrentRoom(DEFAULT_ROOM);
        setCurrentServer(DEFAULT_SERVER);

        const newUser: UserEntity = {type: "user", username: username, uuid: v4(), room: DEFAULT_ROOM};
        setUser(() => {
            return newUser;
        });

        socketManager.disconnectFromAll();
        setSocketManager(new SocketManager(newUser));

        // restart server manager
        setServerManager({servers: new Array<Server>()});
    }

    return (
        <Header pad={"small"} justify={"between"} background={"brand"}>
            <Box direction="row-responsive" justify="center" align="center" gap={"15px"}>
                <Globe/>
                <h2>EyeSocket</h2>
                <p>Express yourself without consequences.</p>
                <Anchor label={<p>Connect to <em>Main Hub</em></p>} onClick={() => connectToHubServer()}/>
            </Box>
            <Box direction="row-responsive" justify="center" align="center" gap={"15px"}>
                <TextInput
                    placeholder="username"
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                />
                <Button icon={<Update/>} onClick={() => updateUsername()}/>
            </Box>
        </Header>
    );
}