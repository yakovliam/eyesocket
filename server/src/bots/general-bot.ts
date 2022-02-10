import {Command} from "../bot/command";
import roomManager from "../room/room-manager";
import {Bot} from "../bot";
import {BotMessage} from "@common/types/message";
import {ServerMessageEvent} from "@common/types/socket/event";

export class GeneralBot extends Bot {

    constructor() {
        super("GeneralBot", "?", true);

        this.registerCommands();
    }

    // showCommandResultSystemMessage is usually false, but this is a proof-of-concept
    public registerCommands() {
        // list rooms command
        const listRoomsCommand: Command = {
            command: "listRooms",
            aliases: ["listrooms", "lr"],
            executor: (io, socket, args, clientMessageEvent) => {
                if (args.length !== 0) {
                    return {success: false, message: "No args are listed in this command", autoDisplaySystemResult: true}
                }

                const rooms: string[] = roomManager.rooms.map(r => r.name ? r.name : r.handle);

                // since showCommandResultSystemMessage is enabled, I'll just return this object and
                // let the logic take care of showing it to the user
                return {success: true, message: "All rooms: " + JSON.stringify(rooms), autoDisplaySystemResult: true}
            }
        }

        this.getCommandHandler().registerCommand(listRoomsCommand);

        // image command
        const imageCommand: Command = {
            command: "image",
            aliases: ["img", "im"],
            executor: (io, socket, args, clientMessageEvent) => {
                if (args.length !== 1) {
                    return {success: false, message: "Specify an image URL", autoDisplaySystemResult: true}
                }

                const botMessage: BotMessage = {
                    type: "bot",
                    sender: this.botEntity,
                    content: `![Image](${args[0]})`
                }

                const botMessageEvent: ServerMessageEvent = {
                    isGlobal: false,
                    message: botMessage,
                    room: clientMessageEvent.room
                }

                // emit to room
                io.to(clientMessageEvent.room.handle).emit("message", botMessageEvent);

                // create markdown image
                return {success: true, message: "", autoDisplaySystemResult: false}
            }
        }

        this.getCommandHandler().registerCommand(imageCommand);
    }
}