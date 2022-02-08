import {registerJoinRoomHooks, registerMessageHook} from "./bot-hook";
import {ServerMessageEvent} from "common/types/socket/event";
import {BotMessage} from "common/types/message";
import {Client} from "../client";
import clientManager from "../client/client-manager";

export class ExampleBot {

    constructor() {
        this.init();
    }

    public init() {
        console.log("Initializing ExampleBot!");
        registerJoinRoomHooks((io, socket, clientJoinRoomEvent) => {
            // get client
            const client: Client = clientManager.clients.find(c => c.socket === socket);

            const botMessage: BotMessage = {
                type: "bot",
                content: "Welcome to the room, " + client.user.username + ""
                    + "<h4>Available Commands:</h4><br/>"
                    + "1. !coinflip"
            }
            const serverMessageEvent: ServerMessageEvent = {
                isGlobal: false,
                room: clientJoinRoomEvent.room,
                message: botMessage
            };
            io.to(clientJoinRoomEvent.room.handle).emit("message", serverMessageEvent);
        });
        registerMessageHook((io, socket, clientMessageEvent) => {
            if (clientMessageEvent.message.content === "!coinflip") {
                const output: string = Math.floor(Math.random() * 2) === 0 ? "tails" : "heads";

                const botMessage: BotMessage = {
                    type: "bot",
                    content: `**You flipped:** <br/>${output}`
                }
                const serverMessageEvent: ServerMessageEvent = {
                    isGlobal: false,
                    room: clientMessageEvent.room,
                    message: botMessage
                };

                io.to(clientMessageEvent.room.handle).emit("message", serverMessageEvent);
            }
        });
    }
}