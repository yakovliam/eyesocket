import {Keyboard, TextInput} from "grommet";
import {useState} from "react";
import useBus, {dispatch} from "use-bus";
import {room} from "../../state";

export function SendBox() {
    const [value, setValue] = useState("");

    useBus("@@CLIENT/SEND_MESSAGE_ACTION", () => {
        if (!value) {
            return;
        }

        // clear value
        setValue("");

        room.sendMessage(value);
    }, [value, room]);

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