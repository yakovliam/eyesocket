/**
 * This objects represents a message with content sent from an entity,
 * received explicitly by a server
 */
export type ContentedMessage = {
    type: string;
    content: string;
}

export type UserMessage = ContentedMessage & {
    type: "user";
}

export type BotMessage = ContentedMessage & {
    type: "bot"
}

export type SystemMessage = ContentedMessage & {
    type: "system"
}
