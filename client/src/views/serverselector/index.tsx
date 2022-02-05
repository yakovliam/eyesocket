import {Box, Button, Collapsible, TextInput} from "grommet";
import {useCallback, useEffect, useState} from "react";
import {FormClose, StatusGoodSmall} from "grommet-icons";
import loadingSvg from "assets/loading.svg";
import {useRecoilState} from "recoil";
import {currentRoomState} from "state/recoil";
import {RequestRegistry} from "object/request/registry";
import {ServerPingResponse} from "object/request";
import {Server} from "object/server";
import {OnlineState} from "object/server/online-state";
import {Room} from "object/server/room";
import useBus from "use-bus";
import {BusEventRegistry} from "object/bus/registry";
import {useServerManager} from "object/server/servermanager";
import {useSocketManager} from "object/socket/socketmanager";

export function ServerSelector() {

    const [serverHostToAdd, setServerHostToAdd] = useState("");
    const [socketManager,] = useSocketManager();
    const [serverManager, , updateServers] = useServerManager();
    const [currentRoom, setCurrentRoom] = useRecoilState(currentRoomState);

    const updateServer = useCallback((oldServer: Server | undefined, newServer: Server) => {
        let servers: Array<Server> = new Array<Server>(...serverManager.servers);

        if (oldServer) {
            // remove old
            servers = servers.filter(el => el.host !== oldServer.host);
        }

        // add server
        servers.push(newServer);

        updateServers(servers);
    }, [updateServers, serverManager]);

    const removeServer = (server: Server) => {
        let servers: Array<Server> = new Array<Server>(...serverManager.servers);
        // remove old
        servers = servers.filter(el => el !== server);

        updateServers(servers);
    }

    const checkAndUpdateServerStatus = useCallback((host: string, server: Server) => {
        // fetch server host to see if its online
        fetch(host + "/" + RequestRegistry.SERVER_PING, {method: 'GET'}).then(r => {
            r.json().then(data => {
                // construct rooms
                const rooms: Array<Room> = data._rooms.map((room: any) => {
                    return new Room(room._handle, room._name);
                });

                // reconstruct server ping response object
                const serverPingResponse: ServerPingResponse = new ServerPingResponse(data._online, rooms);

                // re-add server to server manager, but now it has room info and with online info
                updateServer(server, new Server(server.host, server.name, serverPingResponse.online ? OnlineState.ONLINE : OnlineState.OFFLINE, serverPingResponse.rooms));

                // connect to server
                socketManager.connectToServer(server);
            }).catch(e => {
                console.error(e);
            });
        }).catch(e => {
            // re-add server to server manager, but now it's offline
            updateServer(server, new Server(server.host, server.name, OnlineState.OFFLINE, server.rooms));
        });
    }, [socketManager, updateServer]);

    // add server
    const addServer = () => {
        // if the server is already in the server manager, don't do anything
        if (serverManager.servers.some(s => s.host === serverHostToAdd)) {
            return;
        }

        // add to server manager, but don't make it "online" yet
        const server = new Server(serverHostToAdd, "", OnlineState.CHECKING, []);

        updateServer(undefined, server);
        checkAndUpdateServerStatus(serverHostToAdd, server);
    }

    const joinRoom = (server: Server, room: Room) => {
        // set current room
        setCurrentRoom(room);
        // join room in socket manager
        socketManager.joinRoom(server, room);
    }

    // listen for server disconnect event
    useBus(
        BusEventRegistry.SERVER_CONNECTION_FAILURE,
        (data) => {
            const server: Server = data.payload as Server;

            // get old server
            const oldServer: Server | undefined = serverManager.servers.find(s => s.host === server.host);

            // set server to offline
            const newServer: Server = new Server(server.host, server.name, OnlineState.OFFLINE, oldServer ? oldServer.rooms : server.rooms);

            // update server manager
            updateServer(server, newServer);
        },
        [serverManager, updateServer],
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const servers: Array<Server> = serverManager.servers.filter(s => s.onlineState === OnlineState.OFFLINE);
            servers.forEach(server => {
                checkAndUpdateServerStatus(server.host, server);
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [checkAndUpdateServerStatus, serverManager]);

    return (
        <Box direction={"column"} gap={"small"} flex={"grow"}>
            <Box direction={"row"} gap={"small"}>
                <TextInput
                    placeholder={"https://my.server.com"}
                    value={serverHostToAdd}
                    onChange={event => setServerHostToAdd(event.target.value)}
                />
                <Button primary label={"Add"} onClick={() => addServer()}/>
            </Box>
            <Box>
                {serverManager.servers.map(server => {
                    return (
                        <Box gap={"small"} flex={"grow"} key={server.host}>
                            {/* This button will toggle the opening/closing */}
                            <Box direction={"row"} gap={"xxsmall"}>
                                <Button color={"serverButton"} style={{overflow: "hidden"}}
                                        label={server.name ? server.name : server.host} reverse/>
                                <Button icon=
                                            {server.onlineState === OnlineState.ONLINE ? (
                                                <StatusGoodSmall color={"status-ok"}/>) : (
                                                server.onlineState === OnlineState.CHECKING ?
                                                    <img alt={"Loading"} src={loadingSvg} width={"24px"}/> :
                                                    <StatusGoodSmall color={"status-disabled"}/>)}/>
                                <Button onClick={() => {
                                    // remove self (server) from manager
                                    removeServer(server);
                                }} icon={<FormClose color={"roomXButton"}/>}/>
                            </Box>
                            <Collapsible open={true}>
                                <Box align={"end"} gap={"xsmall"}>
                                    {server.rooms.map(room => {
                                        return (
                                            <Box pad={"small"} key={room.handle}>
                                                <Button
                                                    primary={currentRoom === room}
                                                    color={"roomButton"}
                                                    label={room.name ? room.name : room.handle}
                                                    onClick={() => {
                                                        // join room
                                                        joinRoom(server, room);
                                                    }}
                                                />
                                            </Box>
                                        );
                                    })}
                                </Box>
                            </Collapsible>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}