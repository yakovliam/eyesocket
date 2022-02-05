import {Header, Box, TextInput, Button} from "grommet";
import {Globe, Update} from "grommet-icons";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {serverManagerState, socketManagerState, userState} from "state/recoil";
import {User} from "object/user";
import {ServerManager} from "object/server/servermanager";
import {SocketManager} from "object/socket/socketmanager";

export function NavBar() {

    const [username, setUsername] = useState("");
    const [user, setUser] = useRecoilState(userState);
    const [, setServerManager] = useRecoilState(serverManagerState);
    const [, setSocketManager] = useRecoilState(socketManagerState);

    const updateUsername = () => {
        const newUser = new User(username, user.uuid, undefined);

        setUser(() => {
            return newUser;
        });

        // restart server manager
        setServerManager(() => {
            return new ServerManager([]);
        });

        // restart socket manager
        setSocketManager(() => {
            return new SocketManager(newUser);
        });
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