"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const task_schema_1 = require("../schemas/task.schema");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = express_1.default.Router();
router.post('/tasks', authMiddleware_1.auth, (0, validationMiddleware_1.validateData)(task_schema_1.taskCreationSchema), task_controller_1.taskController.create);
router.get('/task/:id', authMiddleware_1.auth, task_controller_1.taskController.getTask);
router.get('/tasks', authMiddleware_1.auth, (0, validationMiddleware_1.validateQuery)(task_schema_1.getTasksQuerySchema), task_controller_1.taskController.getTasks);
router.put('/task/:id', authMiddleware_1.auth, task_controller_1.taskController.updateTask);
router.delete('/task/:id', authMiddleware_1.auth, (0, authMiddleware_1.roleCheck)(['admin']), task_controller_1.taskController.deleteTask);
exports.default = router;
