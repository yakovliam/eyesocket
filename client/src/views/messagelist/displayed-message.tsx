import {Box, Markdown, Text} from "grommet";
import {ReactElement, useEffect, useRef} from "react";
import {ContentedMessage, UserMessage} from "common/types/message/index";
import {Icon, SettingsOption, System, User} from "grommet-icons";
import {useRecoilValue} from "recoil";
import {userState} from "state/recoil";

type displayedMessageProps = {
    contentedMessage: ContentedMessage
}

export function DisplayedMessage(props: displayedMessageProps) {

    const currentUser = useRecoilValue(userState);

    const ref: any = useRef(null);

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'});
        }
    });

    const calculateAlignment = (message: ContentedMessage) => {
        let align: "end" | "center" | "start";

        if (message.type === "user") {
            if ((message as UserMessage).sender.uuid === currentUser.uuid) {
                align = "end";
            } else {
                align = "start";
            }
        } else if (message.type === "system") {
            align = "start";
        } else if (message.type === "bot") {
            align = "center";
        } else {
            align = "center";
        }

        return align;
    }

    const constructMessage = (message: ContentedMessage) => {

        let icon: ReactElement | undefined;
        let from: string;

        if (message.type === "user") {
            icon = <User size={"large"}/>
            from = (message as UserMessage).sender.username;
        } else if (message.type === "system") {
            icon = <System size={"large"}/>
            from = "System"
        } else if (message.type === "bot") {
            icon = undefined;
            from = "Bot"
        } else {
            icon = undefined;
            from = "Unknown"
        }

        return (
            <Box align={"center"} direction={"row"} gap={"small"} justify={"around"}>
                {icon}
                <Text weight={"bold"}>
                    {from}
                </Text>
                <Markdown>{message.content}</Markdown>
            </Box>
        );
    }

    return (
        <Box ref={ref} direction="row" gap={"xlarge"} align="center" justify={calculateAlignment(props.contentedMessage)}>
            {constructMessage(props.contentedMessage)}
        </Box>
    );
}