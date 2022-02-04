import express from "express";
import {Socket} from "socket.io";
import indexRouter from "./routes/index";
import * as http from "http";
import {Server} from "socket.io";
import {Message, SystemMessage} from "./message";
import * as uuid from "uuid";

const index = express();
const server = http.createServer(index);

const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: false
    }
});

// router
index.use('/', indexRouter);

io.on('connection', (socket: Socket) => {
    // send system message
    socket.on("message", (arg) => {
        try {
            // create message object
            const message = new Message(uuid.v4(), new Date(), arg.username, arg.message);
            // emit to connected clients
            io.emit("message", message);
        } catch (e) {
            console.log("error when interpreting received message - " + e);
        }
    });

    socket.on("connect-alert", (arg) => {
        io.emit("system-message", new SystemMessage(uuid.v4(), new Date(), arg.username + " joined this room."))
    });
    
    socket.on("disconnect-alert", (arg) => {
        io.emit("system-message", new SystemMessage(uuid.v4(), new Date(), arg.username + " left this room."))
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});
