import {Keyboard, TextInput} from "grommet";
import {useState} from "react";
import {dispatch} from "use-bus";

export function SendBox() {
    const [value, setValue] = useState("");

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