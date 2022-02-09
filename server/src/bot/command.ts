import {Server, Socket} from "socket.io";
import {ClientMessageEvent} from "@common/types/socket/event/index";
import {CommandResult} from "./types/command-result";

export type Command = {
    // the command
    command: string;

    // all the aliases for the command
    aliases: string[];

    // the executor that handles the command
    executor: (io: Server, socket: Socket, args: string[], clientMessageEvent: ClientMessageEvent) => CommandResult;
}