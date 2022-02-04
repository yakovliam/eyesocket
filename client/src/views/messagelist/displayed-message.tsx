import {Box, Text} from "grommet";
import {SystemMessage} from "../../state/message";
import {SettingsOption, User} from "grommet-icons";
import {useEffect, useRef} from "react";

export function DisplayedMessage(props: any) {

    const ref: any = useRef(null);

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'});
        }
    });

    return (
        <Box ref={ref} direction="row-responsive" gap="medium" align="center">
            {props.message instanceof SystemMessage ? <SettingsOption size={"large"}/> : <User size={"large"}/>}
            <Text weight="bolder">{props.message.username}</Text>
            <Text weight={"normal"}>{props.message.message}</Text>
        </Box>
    );
}