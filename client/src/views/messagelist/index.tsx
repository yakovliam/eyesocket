import {List} from "grommet";
import "./MessageList.scoped.scss"
import {useState} from "react";
import {DisplayedMessage} from "./displayed-message";

export function MessageList() {
    const defaultState: Array<any> = [];
    const [messages,] = useState(defaultState);

    return (
        <div className={"message-list"}>
            <List data={messages} border={false} pad={"small"}>
                {(msg: any) => (
                    <DisplayedMessage message={msg}/>
                )}
            </List>
        </div>
    );
}
