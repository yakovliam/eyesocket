import React from 'react';
import './App.scoped.scss';
import {NavBar} from "../components/navbar";
import {Box, Button, Notification} from "grommet";
import {SendBox} from "./sendbox";
import {Send} from "grommet-icons";
import {MessageList} from "./messagelist";
import {dispatch} from "use-bus";
import {ServerSelector} from "./serverselector";
import {BusEventRegistry} from "objects/bus/registry";
import {useRecoilState} from "recoil";
import {toasterState} from "state/recoil";

function App() {
    const [toaster, setToaster] = useRecoilState(toasterState);

    return (
        <div className={"app"}>
            {toaster.visible && <Notification toast title={toaster.title} status={toaster.status}
                                              onClose={() => setToaster({...toaster, visible: false})}/>}
            <div>
                <NavBar/>
            </div>
            <div className={"app-body"}>
                <Box className={"app-body-box"} width={"large"} elevation={"large"} direction={"column"}>
                    <Box className={"messagelist-wrapper"} elevation={"medium"} flex={"grow"}>
                        <MessageList/>
                    </Box>

                    <div className={"send-wrapper"}>
                        <div className={"send-box"}>
                            <SendBox/>
                        </div>
                        <Button primary label="Send" icon={<Send/>} onClick={() => {
                            dispatch({type: BusEventRegistry.CLIENT_SEND_MESSAGE_ACTION})
                        }}/>
                    </div>
                </Box>

                <Box className={"app-serverselector-box"} direction={"column"} elevation={"medium"} overflow={"scroll"}>
                    <ServerSelector/>
                </Box>
            </div>
        </div>
    );
}

export default App;
