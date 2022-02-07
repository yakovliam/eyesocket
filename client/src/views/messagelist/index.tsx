import {Box} from "grommet";
import "./MessageList.scoped.scss"
import {useRecoilValue} from "recoil";
import {currentRoomState, currentServerState, serverManagerState} from "state/recoil";
import useBus from "use-bus";
import {BusEventRegistry} from "objects/bus/registry";
import {useState} from "react";
import {ContentedMessage} from "common/types/message/index";
import {ServerMessageDispatchEvent} from "objects/bus/event";
import {Room} from "common/types/server/room/index";
import {DisplayedMessage} from "./displayed-message";

export function MessageList() {

    // <server host, Map<room handle, ContentedMessage[]>>
    const defaultMessagesValue: Map<string, Map<string, Array<ContentedMessage>>> = new Map<string, Map<string, Array<ContentedMessage>>>();

    // global messages
    const [globalMessages, setGlobalMessages] = useState(defaultMessagesValue);

    // current server
    const currentServer = useRecoilValue(currentServerState);

    // current room
    const currentRoom = useRecoilValue(currentRoomState);

    // server manager
    const serverManager = useRecoilValue(serverManagerState);

    // listen for receive message event
    useBus(
        BusEventRegistry.SERVER_MESSAGE_EVENT,
        (data) => {
            const serverMessageDispatchEvent: ServerMessageDispatchEvent = data.payload;

            // get all applicable rooms
            let rooms: Array<Room>;

            // if it's global, use all rooms
            if (serverMessageDispatchEvent.serverMessageEvent.isGlobal) {
                const applicableRooms = serverManager.servers.find(s => s.host === serverMessageDispatchEvent.server.host)?.rooms;
                rooms = applicableRooms === undefined ? [] : applicableRooms;
            } else {
                const applicableRoom = serverManager.servers.find(s => s.host === serverMessageDispatchEvent.server.host)?.rooms?.find(r => r.handle === serverMessageDispatchEvent.serverMessageEvent.room?.handle);
                rooms = applicableRoom === undefined ? [] : [applicableRoom];
            }
            // define a clone of the global message map
            const roomMessageMap: Map<string, ContentedMessage[]> = globalMessages.has(serverMessageDispatchEvent.server.host) ?
                globalMessages.get(serverMessageDispatchEvent.server.host)! : new Map<string, Array<ContentedMessage>>();

            // loop through each applicable room and get the list of messages associated
            rooms.forEach(room => {
                // get associated messages that have already been sent
                let messages: Array<ContentedMessage> | undefined = globalMessages.get(serverMessageDispatchEvent.server.host)?.get(room.handle);

                // if undefined, just initialize empty
                if (messages === undefined) {
                    messages = [];
                }

                // put the new message inside the array
                messages.push(serverMessageDispatchEvent.serverMessageEvent.message);

                // update the room message map
                roomMessageMap.set(room.handle, messages);
            });

            // use our updated room message map to update the global map
            const messageMap = new Map<string, Map<string, ContentedMessage[]>>(globalMessages);
            messageMap.set(serverMessageDispatchEvent.server.host, roomMessageMap);

            // update/set global message map
            setGlobalMessages(messageMap);
        },
        [globalMessages, serverManager]
    );

    return (
        <div className={"message-list"}>
            <Box direction={"column"} gap={"small"}>
                {
                    globalMessages.get(currentServer.host)?.get(currentRoom.handle)?.map((message, idx) => {
                        return <DisplayedMessage contentedMessage={message} key={idx}/>
                    })
                }
            </Box>
        </div>
    );
}
