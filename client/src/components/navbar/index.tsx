import {Header, Box, TextInput, Button} from "grommet";
import {Globe, Update} from "grommet-icons";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {serverManagerState, userState} from "state/recoil";
import {useSocketManager} from "objects/socket/socketmanager";
import {User} from "common/types/user/index";
import {DEFAULT_ROOM} from "common/types/server/room/index";
import {ServerManager} from "objects/server/servermanager";


export function NavBar() {

    const [username, setUsername] = useState("");
    const [user, setUser] = useRecoilState(userState);
    const [, , restartSocketManager] = useSocketManager();
    const [, setServerManager] = useRecoilState(serverManagerState);

    const updateUsername = () => {
        const newUser: User = {username: username, uuid: user.uuid, room: DEFAULT_ROOM};

        setUser(() => {
            return newUser;
        });

        // restart server manager
        setServerManager(new ServerManager([]));

        // restart socket manager
        restartSocketManager(newUser);
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