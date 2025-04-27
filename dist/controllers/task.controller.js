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
exports.taskController = void 0;
const task_1 = require("../models/task");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const task_schema_1 = require("../schemas/task.schema");
const cache_1 = require("../utils/cache");
const redis_1 = require("../utils/redis");
const cache_2 = require("../utils/cache");
exports.taskController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { title, description, status, dueDate, assignedTo } = req.body;
            const newTask = new task_1.Task({
                title,
                description,
                status,
                dueDate,
                assignedTo,
            });
            console.log("assignedTo", assignedTo);
            if (!title || !description || !dueDate || !assignedTo) {
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: "one of title, description, status, dueDate, assignedTo is missing",
                });
                return;
            }
            const savedTask = yield newTask.save();
            yield (0, cache_2.clearTaskCache)(); // invalidate cache
            res.status(201).json(savedTask); // Task created
        }
        catch (err) {
            console.log("error in creating task", err.stack);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err.message });
        }
    }),
    getTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parseResult = task_schema_1.getTaskParamsSchema.safeParse(req.params);
            if (!parseResult.success) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ errors: parseResult.error.flatten() });
                return;
            }
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Invalid Task ID" });
                return;
            }
            const task = yield task_1.Task.findById(id).populate('assignedTo', 'name')
                .select("title description assignedTo")
                .exec();
            if (!task) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: "Task not found" });
                return;
            }
            res.status(http_status_codes_1.StatusCodes.OK).json({ task });
        }
        catch (err) {
            console.log("error in fetching task", err.stack);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err.message });
        }
    }),
    getTasks: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { status, dueDate } = req.validatedQuery;
            const cacheKey = (0, cache_1.generateTasksCacheKey)(req);
            const cachedTasks = yield redis_1.redisClient.get(cacheKey);
            if (cachedTasks) {
                res.status(http_status_codes_1.StatusCodes.OK).json(JSON.parse(cachedTasks));
                return;
            }
            const filter = {};
            if (status) {
                filter.status = status;
            }
            if (dueDate) {
                filter.dueDate = {
                    $gte: new Date(dueDate), // tasks due on or after the provided date
                };
            }
            const tasks = yield task_1.Task.find(filter);
            yield redis_1.redisClient.set(cacheKey, JSON.stringify(tasks), {
                EX: 60
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({ tasks });
            return;
        }
        catch (err) {
            console.log("error in fetching tasks", err.stack);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err.message });
        }
    }),
    updateTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Invalid Task ID" });
                return;
            }
            const updates = req.body;
            const updatedTask = yield task_1.Task.findByIdAndUpdate(id, updates, {
                new: true,
            });
            if (!updatedTask) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Task not found" });
                return;
            }
            yield (0, cache_2.clearTaskCache)(); // invalidate cache
            res.status(http_status_codes_1.StatusCodes.OK).json({ task: updatedTask });
        }
        catch (err) {
            console.log("error in updating task", err.stack);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err.message });
        }
    }),
    deleteTask: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res
                    .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                    .json({ message: "Invalid Task ID" });
                return;
            }
            const deletedTask = yield task_1.Task.findByIdAndDelete(id);
            if (!deletedTask) {
                res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ error: "Task not found" });
                return;
            }
            yield (0, cache_2.clearTaskCache)(); // invalidate cache
            res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Task deleted successfully" });
        }
        catch (err) {
            console.log("error in deleting task", err.stack);
            res
                .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err.message });
        }
    }),
};
