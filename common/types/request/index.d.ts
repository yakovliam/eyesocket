import { Room } from "../server/room";
export declare type ServerPingResponse = {
    online: boolean;
    rooms: Array<Room>;
};
