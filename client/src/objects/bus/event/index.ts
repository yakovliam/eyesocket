import {ServerMessageEvent} from "common/types/socket/event/index";
import {Server} from "common/types/server";

export type ServerMessageDispatchEvent = {

    // server message event
    serverMessageEvent: ServerMessageEvent;

    // server
    server: Server;
}