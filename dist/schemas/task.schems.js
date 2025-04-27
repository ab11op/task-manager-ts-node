"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskParamsSchema = exports.taskCreationSchema = exports.status = void 0;
const zod_1 = require("zod");
exports.status = ['pending', 'in-progress', 'done'];
exports.taskCreationSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    status: zod_1.z.enum(exports.status).default('pending'),
    dueDate: zod_1.z.string().datetime(),
    assignedTo: zod_1.z.string(),
});
exports.getTaskParamsSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, 'Task ID is required'),
});
