/**
 * This objects represents a message with content sent from an entity,
 * received explicitly by a server
 */
import {BotEntity, UserEntity} from "../entity";

export type ContentedMessage = {
    type: string;
    content: string;
}

export type UserMessage = ContentedMessage & {
    sender: UserEntity
    type: "user";
}

export type BotMessage = ContentedMessage & {
    sender: BotEntity
    type: "bot"
}

export type SystemMessage = ContentedMessage & {
    type: "system"
}
