import {Keyboard, TextInput} from "grommet";
import {useState} from "react";
import useBus, {dispatch} from "use-bus";
import {useSocketManager} from "objects/socket/socketmanager";
import {useRecoilValue} from "recoil";
import {currentRoomState, currentServerState} from "state/recoil";
import {ClientMessageEvent} from "common/types/socket/event/index";
import {UserMessage} from "common/types/message/index";

export function SendBox() {
    const [value, setValue] = useState("");
    const [socketManager, ,] = useSocketManager();
    const currentServer = useRecoilValue(currentServerState);
    const currentRoom = useRecoilValue(currentRoomState);

    // listen for client send message action
    useBus(
        "@@CLIENT/SEND_MESSAGE_ACTION",
        () => {
            const uCM: UserMessage = {type: "user", content: value};
            const cME: ClientMessageEvent = {room: currentRoom, message: uCM};

            // todo do fancy toast saying you need to join a room
            // if (!currentServer || !currentRoom) {
            //
            // }

            // call socket manager send message
            socketManager.sendMessage(currentServer, cME);
        },
        [value, socketManager, currentRoom, currentServer]
    )

    return (
        <div>
            <Keyboard
                onEnter={() => dispatch({type: "@@CLIENT/SEND_MESSAGE_ACTION"})}>
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