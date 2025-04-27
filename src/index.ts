import * as dotenv from 'dotenv';
import * as path from 'path';
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path: envPath });

import express, { Request, Response } from 'express';
import http from 'node:http';
import { loadConfig } from './config/env';
import { connectToDatabase } from './database/db';
import { requestLogger } from './middlewares/requestLogger';
import { connectToRedis } from './utils/redis';
import userRouter from './routes/user.route'
import taskRouter from './routes/task.route'

export const app = express();
export const server = http.createServer(app);

// middlewares
app.use(express.json({ limit: '50kb' }));
app.use(requestLogger);

// routes
app.get('/', (req: Request, res: Response) => {
    res.status(200).json('Task manager API working');
});
app.use('/api', userRouter);
app.use('/api', taskRouter);

// no listen() here
export const init = async () => {
    try {
        const config = await loadConfig();
        await connectToDatabase();
        await connectToRedis();
        return Number(config.port) || 3000;
    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
};