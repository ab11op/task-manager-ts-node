"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
var Status;
(function (Status) {
    Status["PENDING"] = "pending";
    Status["IN_PROGRESS"] = "in_progress";
    Status["COMPLETED"] = "completed";
    Status["CANCELLED"] = "cancelled";
})(Status || (Status = {}));
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.PENDING,
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
