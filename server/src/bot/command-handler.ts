import {Command} from "./command";
import {Server, Socket} from "socket.io";
import {ClientMessageEvent} from "@common/types/socket/event/index";
import {CommandResult} from "./types/command-result";
import {registerMessageHook} from "../hooks/bot-hooks";
import {BotEntity} from "@common/types/entity/index";
import {SystemMessage} from "@common/types/message/index";
import {ServerMessageEvent} from "@common/types/socket/event";

export class CommandHandler {

    // a list of registered commands
    private commands: Array<Command> = [];

    // the prefix for each command
    public commandPrefix: string;

    // the associated bot entity
    private botEntity: BotEntity;

    // if commands should show the user a system message result of the command
    private readonly showCommandResultSystemMessage: boolean;

    // constructor
    constructor(commandPrefix: string, botEntity: BotEntity, showCommandResultSystemMessage: boolean) {
        this.commandPrefix = commandPrefix;
        this.botEntity = botEntity;
        this.showCommandResultSystemMessage = showCommandResultSystemMessage;
    }

    /**
     * Registers a command
     * @param command command
     * @param preCommandExecutionCallback a callback to run before the command is actually executed.
     * The result of this callback (boolean) will determine if the command is to be executed or not.
     */
    public registerCommand(command: Command, preCommandExecutionCallback: ((clientMessageEvent: ClientMessageEvent) => boolean) | undefined) {
        this.commands.push(command);

        // listen for message hooks
        registerMessageHook((io, socket, clientMessageEvent) => {
            if (!clientMessageEvent.message.content.startsWith(this.commandPrefix)) {
                return;
            }

            if (preCommandExecutionCallback && !preCommandExecutionCallback(clientMessageEvent)) {
                return;
            }

            const result: CommandResult = this.execute(io, socket, clientMessageEvent);

            if (this.showCommandResultSystemMessage) {
                const message: SystemMessage = this.buildResultSystemMessage(result);
                const messageEvent: ServerMessageEvent = {
                    message: message,
                    isGlobal: false,
                    room: clientMessageEvent.room
                }
                // emit to that whole room
                io.to(clientMessageEvent.room.handle).emit("message", messageEvent);
            }
        });
    }

    private getCommand(commandOrAlias: string): Command | undefined {
        return this.commands.find(c => c.command === commandOrAlias || c.aliases.includes(commandOrAlias));
    }

    public execute(io: Server, socket: Socket, clientMessageEvent: ClientMessageEvent): CommandResult {
        // split the line by spaces
        const parts: string[] = clientMessageEvent.message.content.split(" ");

        // if there is nothing
        if (parts.length < 1) {
            return {success: false, message: "Not a command"};
        }

        // get the command applicable
        const command: Command | undefined = this.getCommand(parts[0].replace("!", ""));

        if (command === undefined) {
            return {success: false, message: "Not a command"};
        }

        // compile arguments to the command
        const args: string[] = parts.splice(1);

        // execute command
        return command.executor(io, socket, args, clientMessageEvent);
    }

    protected buildResultSystemMessage(commandResult: CommandResult): SystemMessage {
        return {
            type: "system",
            content: commandResult.success ? commandResult.message : "**Failed to run.** Result: *" + commandResult.message + "*"
        }
    }
}