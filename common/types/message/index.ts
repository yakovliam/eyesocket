/**
 * This objects represents a message with content sent from an entity,
 * received explicitly by a server
 */
import {User} from "../user/index";

export type ContentedMessage = {
    type: string;
    content: string;
}

export type UserMessage = ContentedMessage & {
    sender: User
    type: "user";
}

export type BotMessage = ContentedMessage & {
    type: "bot"
}

export type SystemMessage = ContentedMessage & {
    type: "system"
}
