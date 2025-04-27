import {Request} from 'express'
import { redisClient } from './redis';

export const generateTasksCacheKey = (req: Request) => {
    const { status, dueDate } = req.query;
    let key = 'tasks_cache';
    if (status) key += `:status=${status}`;
    if (dueDate) key += `:dueDate=${dueDate}`;
    return key;
  };
  export const clearTaskCache = async () => {
    const keys = await redisClient.keys('tasks_cache*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  };