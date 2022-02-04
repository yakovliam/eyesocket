import {atom} from "recoil";
import {User} from "object/user";
import {ServerManager} from "object/server/servermanager";
import {Server} from "object/server";
import {SocketManager} from "object/socket/socketmanager";

export const userState = atom({
    key: 'userState',
    default: User.ANON
});

export const serverManagerState = atom({
    key: "serverManagerState",
    default: new ServerManager(new Array<Server>())
});

export const socketManagerState = atom({
    key: "socketManagerState",
    default: new SocketManager(User.ANON)
})