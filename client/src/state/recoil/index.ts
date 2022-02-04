import {atom} from "recoil";
import {User} from "../user";
import {v4} from "uuid";
import {ServerManager} from "../server/servermanager";
import {Server} from "state/server";

export const userState = atom({
    key: 'userState',
    default: new User("user-" + Math.random() * (99999 - 10000) + 10000, v4())
});

export const serverManagerState = atom({
    key: "serverManagerState",
    default: new ServerManager(new Array<Server>())
});