import {Box} from "grommet";
import "./MessageList.scoped.scss"
import {useRecoilState, useRecoilValue} from "recoil";
import {currentRoomState, currentServerState, serverManagerState} from "state/recoil";
import useBus from "use-bus";
import {BusEventRegistry} from "objects/bus/registry";
import {useEffect, useState} from "react";
import {Server} from "common/types/server";
import {Room} from "common/types/server/room/index";
import {ContentedMessage} from "common/types/message/index";
import {ServerMessageDispatchEvent} from "objects/bus/event";

export function MessageList() {

    const defaultMessagesValue: Map<Server, Map<Room, Array<ContentedMessage>>> = new Map<Server, Map<Room, Array<ContentedMessage>>>();
    const [globalMessages, setGlobalMessages] = useState(defaultMessagesValue);
    const currentServer = useRecoilValue(currentServerState);
    const [currentRoom,] = useRecoilState(currentRoomState);
    const [serverManager,] = useRecoilState(serverManagerState);

    const defaultCurrentRoomMessagesState: Array<ContentedMessage> = [];
    const [currentRoomMessagesState, setCurrentRoomMessagesState] = useState(defaultCurrentRoomMessagesState);

    // listen for receive message event
    useBus(
        BusEventRegistry.SERVER_MESSAGE_EVENT,
        (data) => {
            const serverMessageDispatchEvent: ServerMessageDispatchEvent = data.payload;
            const server: Server | undefined = serverManager.servers.find(s => s.host === serverMessageDispatchEvent.server.host);

            if (server === undefined) {
                // todo there's a problem...
                return;
            }

            // get all rooms that the message should be sent in
            const rooms: Array<Room | undefined> | undefined = serverMessageDispatchEvent.serverMessageEvent.isGlobal
                ? serverManager.servers.find(s => s.host === server.host)?.rooms
                : [server.rooms.find(r => r.handle === serverMessageDispatchEvent.serverMessageEvent.room?.handle)];

            if (rooms === undefined) {
                return;
            }


            // loop through all applicable rooms to add the message
            rooms.forEach((room: Room | undefined) => {
                if (room === undefined) {
                    return;
                }

                // get all messages in current server + room
                let messages: Array<ContentedMessage> | undefined = globalMessages.get(serverMessageDispatchEvent.server)?.get(room);
                // if there aren't any messages, make a new message array
                if (messages === undefined) {
                    messages = [];
                }

                // add the received message to the array of messages
                messages.push(serverMessageDispatchEvent.serverMessageEvent.message);

                // now that we've updated the messages list for that room, update the map
                const newGlobalMessagesMap = globalMessages;
                const newSubMap: Map<Room, Array<ContentedMessage>> = new Map<Room, Array<ContentedMessage>>();
                newSubMap.set(room, messages);


                newGlobalMessagesMap.set(serverMessageDispatchEvent.server, newSubMap);
                // update
                setGlobalMessages(newGlobalMessagesMap);
            });

            // todo fix issue making it so component isn't force updating

        },
        [globalMessages, currentServer, currentRoom, serverManager, setGlobalMessages]
    );

    useEffect(() => {
        const roomMessages: Map<Room, Array<ContentedMessage>> | undefined = Array.from(globalMessages)
            .filter((arr) => arr[0].host === currentServer.host)
            .map((arr) => arr[1])[0];

        if (roomMessages === undefined) {
            setCurrentRoomMessagesState([]);
            return;
        }

        const currentRoomMessages: ContentedMessage[] | undefined = Array.from(roomMessages)
            .filter((arr) => arr[0].handle === currentRoom.handle)
            .map((arr) => arr[1])[0];

        if (currentRoomMessages === undefined) {
            setCurrentRoomMessagesState([]);
            return;
        }

        setCurrentRoomMessagesState(currentRoomMessages);

    }, [setCurrentRoomMessagesState, globalMessages]);


    return (
        <div className={"message-list"}>
            <Box direction={"column"} gap={"small"}>
                {
                    currentRoomMessagesState.map((message, idx) => {
                        return <p key={idx}>{message.content}</p>
                    })
                }
            </Box>
        </div>
    );
}
