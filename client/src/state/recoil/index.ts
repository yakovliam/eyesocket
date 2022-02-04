import {atom} from "recoil";
import {User} from "../user/user";
import {v4} from "uuid";

export const userState = atom({
    key: 'userState',
    default: new User("user-" + Math.random() * (99999 - 10000) + 10000, v4())
});