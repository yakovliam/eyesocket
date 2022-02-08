import {Box, Markdown, Text} from "grommet";
import {useEffect, useRef} from "react";
import {ContentedMessage, UserMessage} from "common/types/message/index";
import {Actions, Robot, User} from "grommet-icons";
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
            align = "center";
        } else if (message.type === "bot") {
            align = "start";
        } else {
            align = "start";
        }

        return align;
    }

    const constructMessage = (message: ContentedMessage) => {
        let from: string;

        if (message.type === "user") {
            from = (message as UserMessage).sender.username;
        } else if (message.type === "system") {
            from = "System"
        } else if (message.type === "bot") {
            // todo implement bot senders/entities
            from = "Bot"
        } else {
            from = "Unknown"
        }

        if (message.type === "system") {
            return (
                <Box style={{opacity: "50%"}} align={"center"} direction={"row"} gap={"small"} justify={"around"} background={"light-1"}
                     pad={"small"}>
                    <Box direction={"row"} gap={"small"} align={"center"} justify={"around"}>
                        <Actions size={"small"}/>
                        <Text size={"xsmall"}>{from}</Text>
                        <Markdown>{message.content}</Markdown>
                    </Box>
                </Box>
            );
        } else if (message.type === "bot") {
            return (
                <Box align={"center"} direction={"row"} gap={"small"} justify={"around"} background={"light-2"}
                     round={"small"} pad={"small"}>
                    <Box direction={"column"} gap={"small"}>
                        <Markdown>{message.content}</Markdown>
                        <Box direction={"row"} gap={"small"} justify={"center"} align={"center"}>
                            <Robot size={"small"}/>
                            <Text size={"xsmall"} weight={"bold"}>
                                {from}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            );
        } else if (message.type === "user") {
            return (<Box align={"center"} direction={"row"} gap={"small"} justify={"around"} background={"light-2"}
                         round={"small"} pad={"small"}>
                    <Box direction={"column"} gap={"small"}>
                        <Markdown>{message.content}</Markdown>
                        <Box direction={"row"} gap={"small"} justify={"center"} align={"center"}>
                            <User size={"small"}/>
                            <Text size={"xsmall"} weight={"bold"}>
                                {from}
                            </Text>
                        </Box>
                    </Box>
                </Box>
            );
        } else {
            // this will never happen, but ya gotta cover the case
            return <>{message.content}</>;
        }
    }

    return (
        <Box ref={ref} direction="row" gap={"xlarge"} align="center"
             justify={calculateAlignment(props.contentedMessage)}>
            {constructMessage(props.contentedMessage)}
        </Box>
    );
}