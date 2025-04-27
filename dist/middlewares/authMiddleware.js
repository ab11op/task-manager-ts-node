"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleCheck = exports.auth = exports.SECRET_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
exports.SECRET_KEY = process.env.JWT_SECRET;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Token not provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
        req.token = decoded;
        next();
    }
    catch (err) {
        if (err.name === 'TokenExpiredError') {
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'Token expired' });
            return;
        }
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Please authenticate");
        return;
    }
});
exports.auth = auth;
const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        try {
            const customReq = req;
            const userRole = customReq.token.role;
            if (!allowedRoles.includes(userRole)) {
                res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ message: 'only admins allowed for this operation' });
                return;
            }
            next();
        }
        catch (err) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(err.message);
            return;
        }
    };
};
exports.roleCheck = roleCheck;
