import {UserEntity} from "../../entity";

export type UserHandshakePacket = {
    // the user
    user: UserEntity;
}