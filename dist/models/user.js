"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Role = void 0;
const mongoose_1 = require("mongoose");
// 1. Create an interface representing a document in MongoDB.
var Role;
(function (Role) {
    Role["USER"] = "user";
    Role["ADMIN"] = "admin";
})(Role || (exports.Role = Role = {}));
// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    password: { type: String, required: true },
});
// 3. Create a Model.
exports.User = (0, mongoose_1.model)('User', userSchema);
