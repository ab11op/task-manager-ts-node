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
exports.userController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
exports.userController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, name, role, password } = req.body;
            if (!email || !name || !role || !password) {
                res
                    .status(400)
                    .json({ error: "One of email, name, role, or password is missing" });
                return;
            }
            const existingUser = yield user_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }
            const saltRounds = 10;
            const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
            yield user_1.User.create({ email, name, role, password: hashedPassword });
            res.status(201).json({ message: "User registered" });
        }
        catch (err) {
            res.status(500).json({ message: "Registration failed", error: err.message });
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const userDoc = yield user_1.User.findOne({ email }).lean(); // lean() makes it a plain object
            if (!userDoc) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }
            // Cast userDoc to userResponse type
            const user = {
                name: userDoc.name,
                email: userDoc.email,
                role: userDoc.role,
                password: userDoc.password,
            };
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Invalid credentials" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: userDoc._id, role: user.role }, // userDoc has _id
            JWT_SECRET, { expiresIn: "1h" });
            const response = { token };
            res.status(200).json(response);
        }
        catch (err) {
            console.error(err);
            res
                .status(500)
                .json({ message: "Login failed", error: err.message });
        }
    }),
};
