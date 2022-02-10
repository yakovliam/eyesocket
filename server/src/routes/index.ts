import express from "express";
import roomManager from "../room/room-manager";
import {RequestRegistry} from "@common/types/request/registry";
import {ServerPingResponse} from "@common/types/request";

const router = express.Router();

/* GET server ping */
router.get("/", (req, res, next) => {
    res.send("access denied.").status(403);
});

/* GET server ping */
router.get("/" + RequestRegistry.SERVER_PING, (req, res, next) => {
    // construct response objects
    const serverPingResponse: ServerPingResponse = {online: true, name: process.env.SERVER_NAME, rooms: roomManager.rooms};
    res.send(serverPingResponse).status(200);
});

export default router;