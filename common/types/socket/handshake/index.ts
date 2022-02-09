import {User} from "../../../../../../common/types/entity";

export type UserHandshakePacket = {
    // the user
    user: User;
}