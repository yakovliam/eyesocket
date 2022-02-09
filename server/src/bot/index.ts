import {BotEntity} from "@common/types/entity/index";
import {CommandHandler} from "./command-handler";
import {v4} from "uuid";
export class Bot {

    // the bots' entity
    private readonly botEntity: BotEntity;

    // the bots' command handler
    private readonly commandHandler: CommandHandler;

    constructor(botName: string, commandPrefix: string, showCommandResultSystemMessage: boolean) {
        // initialize bot entity
        this.botEntity = {type: "bot", username: botName, uuid: v4()};
        // initialize command handler
        this.commandHandler = new CommandHandler(commandPrefix, this.botEntity, showCommandResultSystemMessage);
    }

    public getCommandHandler() {
        return this.commandHandler;
    }
}