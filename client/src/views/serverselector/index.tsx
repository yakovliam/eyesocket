import {Box, Button, Collapsible, TextInput} from "grommet";
import {useState} from "react";
// import {StatusGoodSmall} from "grommet-icons";
import loadingSvg from "assets/loading.svg";
import {useRecoilState} from "recoil";
import {serverManagerState} from "state/recoil";
import {Room} from "state/server/room";

export function ServerSelector() {

    const [serverHostToAdd, setServerHostToAdd] = useState("");
    const [serverManager,] = useRecoilState(serverManagerState);

    return (
        <Box direction={"column"} gap={"small"} flex={"grow"}>
            <Box direction={"row"} gap={"small"}>
                <TextInput
                    placeholder={"http://my.server.com"}
                    value={serverHostToAdd}
                    onChange={event => setServerHostToAdd(event.target.value)}
                />
                <Button primary label={"Add"}/>
            </Box>
            <Box>
                {serverManager.servers.map(server => {
                    return (
                        <Box gap={"xxsmall"} flex={"grow"}>
                            {/* This button will toggle the opening/closing */}
                            <Button color={"serverButton"} label={server.name ? server.name : server.host} reverse
                                    icon={<img alt={"Loading"} src={loadingSvg} width={"25px"}/>}/>
                            <Collapsible open={true}>
                                <Box align={"end"} gap={"xsmall"}>
                                    {server.rooms.map(room => {
                                        return (
                                            <Box pad={"small"}>
                                                <Button color={"roomButton"} label={room.handle ? room.handle : room.name}/>
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