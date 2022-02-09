import {Command} from "../bot/command";
import roomManager from "../room/room-manager";
import {Bot} from "../bot";

export class GeneralBot extends Bot {

    constructor() {
        super("GeneralBot", "!", true);

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
                    return {success: false, message: "No args are listed in this command"}
                }

                const rooms: string[] = roomManager.rooms.map(r => r.name ? r.name : r.handle);

                // since showCommandResultSystemMessage is enabled, I'll just return this object and
                // let the logic take care of showing it to the user
                return {success: true, message: "All rooms: " + JSON.stringify(rooms)}
            }
        }

        // register
        this.getCommandHandler().registerCommand(listRoomsCommand, undefined);
    }
}