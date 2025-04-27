import mongoose, { Schema, model, connect } from 'mongoose';

enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

interface ITask {
  title: string;
  description: string;
  dueDate: Date;
  status: Status;
  assignedTo: mongoose.Types.ObjectId; // Correct way
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true }, 
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.PENDING,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = model<ITask>('Task', taskSchema);
