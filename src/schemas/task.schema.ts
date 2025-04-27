import { z } from "zod";

export const status = ['pending', 'in-progress', 'done'] as const;

export const taskCreationSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(status).default('pending'),
  dueDate: z.string().datetime(),
  assignedTo: z.string(),
});

export const getTaskParamsSchema = z.object({
    id: z.string().min(1, 'Task ID is required'),
  });

export const getTasksQuerySchema = z.object({
  status: z.string().optional(),
  dueDate: z.string().optional(),
});



