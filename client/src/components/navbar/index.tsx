import {Button, Header, Box, TextInput} from "grommet";
import {Connect, Globe} from "grommet-icons";
import React, {useState} from "react";
import {room} from "../../state";

export function NavBar() {

    const [username, setUsername] = useState("");
    const [host, setHost] = useState("");

    return (
        <Header pad={"small"} justify={"between"} background="brand">
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
                <TextInput
                    placeholder="host"
                    value={host}
                    onChange={event => setHost(event.target.value)}
                />
                <Button icon={<Connect/>} onClick={() => {
                    if (!username) {
                        // todo pretty toast
                        alert("You need to specify a username!");
                        return;
                    }

                    if (!host) {
                        // todo pretty toast
                        alert("You need to specify a host!");
                        return;
                    }

                    room.username = username;
                    room.host = host;

                    // connect
                    room.connect();
                }} hoverIndicator/>
            </Box>
        </Header>
    );
}