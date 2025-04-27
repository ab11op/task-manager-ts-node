"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const userSchema_1 = require("../schemas/userSchema");
const router = express_1.default.Router();
router.post('/register', (0, validationMiddleware_1.validateData)(userSchema_1.userRegistrationSchema), user_controller_1.userController.register);
router.post('/login', (0, validationMiddleware_1.validateData)(userSchema_1.userLoginSchema), user_controller_1.userController.login);
exports.default = router;
