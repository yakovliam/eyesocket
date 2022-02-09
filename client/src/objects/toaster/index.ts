import {StatusType} from "grommet";

export type ToasterState = {
    status: StatusType,
    title: string,
    visible: boolean
}

export const DEFAULT_TOASTER_STATE: ToasterState = {status: "critical", title: "", visible: false};