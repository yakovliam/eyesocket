import {Box, Button, Collapsible, TextInput} from "grommet";
import {useState} from "react";
import {FormClose, StatusGoodSmall} from "grommet-icons";
import loadingSvg from "assets/loading.svg";
import {useRecoilState} from "recoil";
import {serverManagerState, socketManagerState} from "state/recoil";
import {RequestRegistry} from "object/request/registry";
import {ServerPingResponse} from "object/request";
import {Server} from "object/server";
import {ServerManager} from "object/server/servermanager";
import {OnlineState} from "object/server/online-state";

export function ServerSelector() {

    const [serverHostToAdd, setServerHostToAdd] = useState("");
    const [serverManager, setServerManager] = useRecoilState(serverManagerState);
    const [socketManager,] = useRecoilState(socketManagerState);

    const updateServerManager = (oldServer: Server | undefined, newServer: Server) => {
        setServerManager((serverManager) => {
            let servers: Array<Server> = new Array<Server>(...serverManager.servers);

            if (oldServer) {
                // remove old
                servers = servers.filter(el => el !== oldServer);
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

    // add server
    const addServer = () => {
        // if the server is already in the server manager, don't do anything
        if (serverManager.servers.some(s => s.host === serverHostToAdd)) {
            return;
        }

        // add to server manager, but don't make it "online" yet
        const server = new Server(serverHostToAdd, "", OnlineState.CHECKING, []);

        updateServerManager(undefined, server);

        // fetch server host to see if its online
        fetch(serverHostToAdd + "/" + RequestRegistry.SERVER_PING, {method: 'GET'}).then(r => {
            r.json().then(data => {
                // create server ping response object
                const serverPingResponse: ServerPingResponse = data as ServerPingResponse;

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
                        <Box gap={"small"} flex={"grow"}>
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
                                            <Box pad={"small"}>
                                                <Button color={"roomButton"}
                                                        label={room.handle ? room.handle : room.name}/>
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