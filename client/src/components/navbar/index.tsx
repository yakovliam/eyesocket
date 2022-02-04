import {Header, Box, TextInput, Button} from "grommet";
import { Globe, Update} from "grommet-icons";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {userState} from "../../state/recoil";
import {User} from "state/user";

export function NavBar() {

    const [username, setUsername] = useState("");
    const [, setUser] = useRecoilState(userState);

    const updateUsername = () => {
        setUser((u) => {
            return new User(username, u.uuid);
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