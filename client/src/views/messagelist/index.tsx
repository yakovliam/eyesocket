import {List} from "grommet";
import "./MessageList.scoped.scss"
import {useState} from "react";
import {Message} from "../../state/message";
import useBus, {EventAction} from "use-bus";
import {DisplayedMessage} from "./displayed-message";

export function MessageList() {
    const defaultState: Array<Message> = [];
    const [messages, setMessages] = useState(defaultState);

    // listen to dispatched message events
    useBus(
        "@@ROOM/MESSAGE_RECEIVE",
        (content: EventAction) => {
            setMessages([...messages, content.payload])
        },
        [messages]
    );

    useBus(
        "@@ROOM/CONNECT",
        (content: EventAction) => {
            setMessages([...messages, content.payload])
        },
        [messages]
    );

    return (
        <div className={"message-list"}>
            <List data={messages} border={false} pad={"small"}>
                {(msg: Message) => (
                    <DisplayedMessage message={msg}/>
                )}
            </List>
        </div>
    );
}
