import express from "express";
import {RequestRegistry} from "../object/request/registry";
import {ServerPingResponse} from "../object/request";
import roomManager from "../room/room-manager";

const router = express.Router();

/* GET server ping */
router.get("/", (req, res, next) => {
    res.send("access denied.").status(403);
});

/* GET server ping */
router.get("/" + RequestRegistry.SERVER_PING, (req, res, next) => {
    // construct response object
    res.send(new ServerPingResponse(true, roomManager.rooms)).status(200);
});

export default router;