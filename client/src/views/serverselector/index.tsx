import {Box, Button, Collapsible, Meter, Spinner, TextInput} from "grommet";
import {useState} from "react";
import {StatusGoodSmall} from "grommet-icons";
import loadingSvg from "../../assets/loading.svg";

export function ServerSelector() {

    const [serverHost, setServerHost] = useState("");

    return (
        <Box direction={"column"} gap={"small"}>
            <Box direction={"row"} gap={"small"}>
                <TextInput
                    placeholder={"http://my.server.com"}
                    value={serverHost}
                    onChange={event => setServerHost(event.target.value)}
                />
                <Button primary label={"Add"}/>
            </Box>

            {/* Single server below */}
            <Box gap={"small"}>
                {/* This button will toggle the opening/closing */}
                <Button color={"serverButton"} label="http://my.server.com" reverse icon={<img src={loadingSvg} width={"25px"}/>}/>
                <Collapsible open={true}>
                    <Box align={"end"} gap={"xxsmall"}>
                        <Box pad={"small"}>
                            <Button color={"roomButton"} label={"Room 1"}/>
                        </Box>
                        <Box pad={"small"}>
                            <Button color={"roomButton"} label={"Room 2"}/>
                        </Box>
                    </Box>
                </Collapsible>
            </Box>

            {/* Single server below */}
            <Box gap={"small"}>
                {/* This button will toggle the opening/closing */}
                <Button color={"serverButton"} label="http://my.server2.com" reverse icon={<StatusGoodSmall color={"status-error"}/>}/>
                <Collapsible open={true}>
                    <Box align={"end"} gap={"xxsmall"}>
                        <Box pad={"small"}>
                            <Button color={"roomButton"} label={"Room General"}/>
                        </Box>
                    </Box>
                </Collapsible>
            </Box>
        </Box>
    );
}