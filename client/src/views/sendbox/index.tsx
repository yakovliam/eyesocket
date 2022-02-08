import {Keyboard, TextInput} from "grommet";
import {useState} from "react";
import useBus, {dispatch} from "use-bus";
import {useRecoilState, useRecoilValue} from "recoil";
import {currentRoomState, currentServerState, serverManagerState, socketManagerState, userState} from "state/recoil";
import {ClientMessageEvent} from "common/types/socket/event/index";
import {UserMessage} from "common/types/message/index";
import {DEFAULT_SERVER} from "common/types/server";
import {DEFAULT_ROOM} from "common/types/server/room/index";
import {BusEventRegistry} from "objects/bus/registry";

export function SendBox() {
    const [value, setValue] = useState("");
    const [socketManager,] = useRecoilState(socketManagerState);
    const serverManager = useRecoilValue(serverManagerState);
    const currentServer = useRecoilValue(currentServerState);
    const currentRoom = useRecoilValue(currentRoomState);
    const currentUser = useRecoilValue(userState);

    // listen for client send message action
    useBus(
        BusEventRegistry.CLIENT_SEND_MESSAGE_ACTION,
        () => {
            const uCM: UserMessage = {type: "user", content: value, sender: currentUser};
            const cME: ClientMessageEvent = {room: currentRoom, message: uCM};

            // if message is empty, do noting
            if (!cME.message.content || cME.message.content === "") {
                return;
            }

            // todo do fancy toast saying you need to join a room
            if (!currentServer || !currentRoom || currentServer === DEFAULT_SERVER || currentRoom === DEFAULT_ROOM ||
                !serverManager.servers.some(s => s.host === currentServer.host) || !socketManager.isConnected(currentServer)) {
                return;
            }

            // call socket manager send message
            socketManager.sendMessage(currentServer, cME);

            // clear value
            setValue("");
        },
        [value, socketManager, currentRoom, currentServer]
    )

    return (
        <div>
            <Keyboard
                onEnter={() => dispatch({type: BusEventRegistry.CLIENT_SEND_MESSAGE_ACTION})}>
                <TextInput
                    placeholder="Type your message here..."
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value);
                    }}
                />
            </Keyboard>
        </div>
    );
}