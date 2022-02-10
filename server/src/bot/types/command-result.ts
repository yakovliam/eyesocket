export type CommandResult = {
    // if the command was successful
    success: boolean;

    // the message to return
    message: string;

    // if the command result is to display in an auto message
    autoDisplaySystemResult: boolean;
}