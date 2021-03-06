import {Box, Button, Collapsible, TextInput} from "grommet";
import {useCallback, useEffect, useState} from "react";
import {FormClose, StatusGoodSmall} from "grommet-icons";
import loadingSvg from "../../assets/loading.svg";
import {useRecoilState} from "recoil";
import {currentRoomState, currentServerState, serverManagerState, socketManagerState, toasterState} from "state/recoil";
import useBus from "use-bus";
import {BusEventRegistry} from "objects/bus/registry";
import {DEFAULT_SERVER, Server} from "common/types/server";
import {RequestRegistry} from "common/types/request/registry/index";
import {DEFAULT_ROOM, Room} from "common/types/server/room/index";
import {ServerPingResponse} from "common/types/request/index";
import {OnlineState} from "common/types/server/online-state";

export function ServerSelector() {

    const [serverHostToAdd, setServerHostToAdd] = useState("");
    const [socketManager,] = useRecoilState(socketManagerState);
    const [serverManager, setServerManager] = useRecoilState(serverManagerState);
    const [currentRoom, setCurrentRoom] = useRecoilState(currentRoomState);
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

    const removeServer = (server: Server) => {
        let servers: Array<Server> = new Array<Server>(...serverManager.servers);
        // remove old
        servers = servers.filter(el => el !== server);

        setServerManager({servers: servers});
    }

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
                    name: serverPingResponse.name,
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
    const addServer = () => {
        // if the server is already in the server manager, don't do anything
        if (serverManager.servers.some(s => s.host === serverHostToAdd)) {
            return;
        }

        // add to server manager, but don't make it "online" yet
        const server: Server = {host: serverHostToAdd, name: "", onlineState: OnlineState.CHECKING, rooms: []}

        setServerHostToAdd("");

        updateServer(undefined, server);
        checkAndUpdateServerStatus(serverHostToAdd, server);
    }

    const joinRoom = (server: Server, room: Room) => {
        // if already in a room
        if (currentRoom !== DEFAULT_ROOM) {
            socketManager.leaveRoom(server, currentRoom);
        }

        // set current room
        setCurrentRoom(room);
        // set current server
        setCurrentServer(server);
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
            const newServer: Server = {
                host: server.host,
                name: server.name,
                onlineState: OnlineState.OFFLINE,
                rooms: oldServer ? oldServer.rooms : server.rooms
            };

            // update server manager
            updateServer(server, newServer);

            // set current room and server to nothing
            setCurrentServer(DEFAULT_SERVER);
            setCurrentRoom(DEFAULT_ROOM);

            setToaster({
                status: "critical",
                visible: true,
                title: "You got disconnected from " + (server.name ? server.name : server.host)
            });
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
                                <Button color={"serverButton"} style={{overflowY: "scroll"}}
                                        label={server.name ? server.name : server.host} reverse/>
                                <Button icon=
                                            {server.onlineState === OnlineState.ONLINE ? (
                                                <StatusGoodSmall color={"status-ok"}/>) : (
                                                server.onlineState === OnlineState.CHECKING ?
                                                    <img alt={"Loading"} src={loadingSvg} width={"24px"}/> :
                                                    <StatusGoodSmall color={"status-disabled"}/>)}/>
                                <Button onClick={() => {
                                    setCurrentRoom(DEFAULT_ROOM);
                                    setCurrentServer(DEFAULT_SERVER);
                                    // disconnect from socket manager
                                    socketManager.disconnectFromServer(server);
                                    // remove self (server) from manager
                                    removeServer(server);
                                }} icon={<FormClose color={"roomXButton"}/>}/>
                            </Box>
                            <Collapsible open={true}>
                                <Box align={"end"} gap={"xsmall"}>
                                    {server.rooms.map((room: Room) => {
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