"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginSchema = exports.userRegistrationSchema = void 0;
const zod_1 = require("zod");
const roles = ["user", "admin"];
exports.userRegistrationSchema = zod_1.z.object({
    name: zod_1.z.string().min(4),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(roles),
});
exports.userLoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(8),
});
