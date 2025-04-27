import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Task } from "../models/task";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { getTaskParamsSchema } from "../schemas/task.schema";
import {generateTasksCacheKey} from '../utils/cache'
import {redisClient} from '../utils/redis'
import {clearTaskCache} from '../utils/cache'

export const taskController = {
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status, dueDate, assignedTo } = req.body;
      const newTask = new Task({
        title,
        description,
        status,
        dueDate,
        assignedTo,
      });
      console.log("assignedTo", assignedTo);
      if (!title || !description || !dueDate || !assignedTo) {
        res.status(StatusCodes.BAD_REQUEST).json({
          message:
            "one of title, description, status, dueDate, assignedTo is missing",
        });
        return;
      }
      const savedTask = await newTask.save();
      await clearTaskCache(); // invalidate cache
      res.status(201).json(savedTask); // Task created
    } catch (err) {
      console.log("error in creating task", (err as Error).stack);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  },

  getTask: async (req: Request, res: Response): Promise<void> => {
    try {
      const parseResult = getTaskParamsSchema.safeParse(req.params);
      if (!parseResult.success) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: parseResult.error.flatten() });
        return;
      }
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid Task ID" });
        return;
      }
      const task = await Task.findById(id).populate('assignedTo','name')
        .select("title description assignedTo")
        .exec();
      if (!task) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Task not found" });
        return;
      }
      res.status(StatusCodes.OK).json({ task });
    } catch (err) {
      console.log("error in fetching task", (err as Error).stack);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  },

  getTasks: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, dueDate } = (req as any).validatedQuery;
      const cacheKey = generateTasksCacheKey(req);
      const cachedTasks = await redisClient.get(cacheKey);
      if (cachedTasks) {
        res.status(StatusCodes.OK).json(JSON.parse(cachedTasks));
        return
      }
      const filter: Record<string, any> = {};

      if (status) {
        filter.status = status;
      }

      if (dueDate) {
        filter.dueDate = {
          $gte: new Date(dueDate), // tasks due on or after the provided date
        };
      }
      const tasks = await Task.find(filter);
      await redisClient.set(cacheKey, JSON.stringify(tasks), {
        EX: 60
      })
      res.status(StatusCodes.OK).json({ tasks });
      return;
    } catch (err) {
      console.log("error in fetching tasks", (err as Error).stack);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  },

  updateTask: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid Task ID" });
        return;
      }
      const updates = req.body;

      const updatedTask = await Task.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (!updatedTask) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Task not found" });
        return;
      }
      await clearTaskCache(); // invalidate cache
      res.status(StatusCodes.OK).json({ task: updatedTask });
    } catch (err) {
      console.log("error in updating task", (err as Error).stack);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  },

  deleteTask: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid Task ID" });
        return;
      }
      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Task not found" });
        return;
      }
      await clearTaskCache(); // invalidate cache
      res.status(StatusCodes.OK).json({ message: "Task deleted successfully" });
    } catch (err) {
      console.log("error in deleting task", (err as Error).stack);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: (err as Error).message });
    }
  },
};
