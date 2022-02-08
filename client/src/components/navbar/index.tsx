import {Header, Box, TextInput, Button} from "grommet";
import {Globe, Update} from "grommet-icons";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {
    currentRoomState,
    currentServerState,
    serverManagerState,
    socketManagerState,
    userState
} from "state/recoil";
import {User} from "common/types/user/index";
import {DEFAULT_ROOM} from "common/types/server/room/index";
import {DEFAULT_SERVER, Server} from "common/types/server";
import {v4} from "uuid";
import {SocketManager} from "objects/socket/socketmanager";

export function NavBar() {

    const [username, setUsername] = useState("");
    const [, setUser] = useRecoilState(userState);
    const [socketManager, setSocketManager] = useRecoilState(socketManagerState);
    const [, setServerManager] = useRecoilState(serverManagerState);
    const [, setCurrentRoom] = useRecoilState(currentRoomState);
    const [, setCurrentServer] = useRecoilState(currentServerState);

    const updateUsername = () => {
        setCurrentRoom(DEFAULT_ROOM);
        setCurrentServer(DEFAULT_SERVER);

        const newUser: User = {username: username, uuid: v4(), room: DEFAULT_ROOM};
        setUser(() => {
            return newUser;
        });

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