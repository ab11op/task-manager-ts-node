"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = __importDefault(require("node:http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./database/db");
const requestLogger_1 = require("./middlewares/requestLogger");
const redis_1 = require("./utils/redis");
const app = (0, express_1.default)();
const user_route_1 = __importDefault(require("./routes/user.route"));
const task_route_1 = __importDefault(require("./routes/task.route"));
const server = node_http_1.default.createServer(app);
app.use(express_1.default.json({ limit: '50kb' }));
app.get('/', (req, res) => {
    res.json('working');
});
app.use(requestLogger_1.requestLogger);
app.use('/api', user_route_1.default);
app.use('/api', task_route_1.default);
(0, db_1.connectToDatabase)();
(0, redis_1.connectToRedis)();
server.listen(3000, () => {
    console.log('server is up on port 3000');
});
