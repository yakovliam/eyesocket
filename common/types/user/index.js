"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_USER = void 0;
const uuid_1 = require("uuid");
exports.DEFAULT_USER = { username: "user-" + Math.random() * (99999 - 10000) + 10000, uuid: (0, uuid_1.v4)(), room: undefined };
//# sourceMappingURL=index.js.map