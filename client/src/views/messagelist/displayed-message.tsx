import {Box} from "grommet";
import {useEffect, useRef} from "react";
import {Room} from "common/types/server/room/index";
import {ContentedMessage} from "common/types/message/index";

type displayedMessageProps = {
    room: Room,
    contentedMessage: ContentedMessage
}

export function DisplayedMessage(props: displayedMessageProps) {

    const ref: any = useRef(null);

    useEffect(() => {
        if (ref && ref.current) {
            ref.current.scrollIntoView({behavior: 'smooth'});
        }
    });

    return (
        <Box ref={ref} direction="row-responsive" gap="medium" align="center">
            Hello
        </Box>
    );
}