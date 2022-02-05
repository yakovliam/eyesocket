import {Box, Button, Collapsible, TextInput} from "grommet";
import {useCallback, useEffect, useRef, useState} from "react";
import {FormClose, StatusGoodSmall} from "grommet-icons";
import loadingSvg from "assets/loading.svg";
import {useRecoilState} from "recoil";
import {serverManagerState, socketManagerState} from "state/recoil";
import {RequestRegistry} from "object/request/registry";
import {ServerPingResponse} from "object/request";
import {Server} from "object/server";
import {ServerManager} from "object/server/servermanager";
import {OnlineState} from "object/server/online-state";
import {Room} from "object/server/room";
import useBus from "use-bus";
import {BusEventRegistry} from "object/bus/registry";

export function ServerSelector() {

    const [serverHostToAdd, setServerHostToAdd] = useState("");
    const [serverManager, setServerManager] = useRecoilState(serverManagerState);
    const [socketManager,] = useRecoilState(socketManagerState);
    const timelineLoaded = useRef<boolean>(false);

    // listen for server disconnect event
    useBus(
        BusEventRegistry.SERVER_CONNECTION_FAILURE,
        (data) => {
            const server: Server = data.payload as Server;

            // set server to offline
            const newServer: Server = new Server(server.host, server.name, OnlineState.OFFLINE, server.rooms);

            // update server manager
            updateServerManager(server, newServer);
        },
        [setServerManager, serverManager],
    );

    const updateServerManager = (oldServer: Server | undefined, newServer: Server) => {
        setServerManager((serverManager) => {
            let servers: Array<Server> = new Array<Server>(...serverManager.servers);

            if (oldServer) {
                // remove old
                servers = servers.filter(el => el.host !== oldServer.host);
            }

            // add server
            servers.push(newServer);

            return new ServerManager(servers);
        });
    }

    const removeServer = (server: Server) => {
        setServerManager((serverManager) => {
            let servers: Array<Server> = new Array<Server>(...serverManager.servers);
            // remove old
            servers = servers.filter(el => el !== server);
            return new ServerManager(servers);
        });
    }

    const checkAndUpdateServerStatus = (host: string, server: Server) => {
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
                updateServerManager(server, new Server(server.host, server.name, serverPingResponse.online ? OnlineState.ONLINE : OnlineState.OFFLINE, serverPingResponse.rooms));

                // connect to server
                socketManager.connectToServer(server);
            });
        }).catch(e => {
            // re-add server to server manager, but now it's offline
            updateServerManager(server, new Server(server.host, server.name, OnlineState.OFFLINE, []));
        });
    }

    // add server
    const addServer = () => {
        // if the server is already in the server manager, don't do anything
        if (serverManager.servers.some(s => s.host === serverHostToAdd)) {
            return;
        }

        // add to server manager, but don't make it "online" yet
        const server = new Server(serverHostToAdd, "", OnlineState.CHECKING, []);

        updateServerManager(undefined, server);
        checkAndUpdateServerStatus(serverHostToAdd, server);
    }

    useEffect(() => {
        if (!timelineLoaded.current) {
            setInterval(() => {
                console.log("checking");
                // get servers that are offline
                console.log("1");
                const servers: Array<Server> = serverManager.servers.filter(s => s.onlineState === OnlineState.OFFLINE);
                console.log("2- " + JSON.stringify(serverManager.servers));
                servers.forEach(server => {
                    checkAndUpdateServerStatus(server.host, server);
                });
            }, 5000);
            timelineLoaded.current = true;
        }
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
                                                <Button color={"roomButton"}
                                                        label={room.name ? room.name : room.handle}/>
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