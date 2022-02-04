import {Box, Text} from "grommet";
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
        </Box>
    );
}