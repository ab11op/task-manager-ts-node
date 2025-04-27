import * as dotenv from 'dotenv';
import * as path from 'path';
const env = process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `../.env.${env}`);
dotenv.config({ path:envPath });
import express,{Request,Response} from 'express'
import http from 'node:http'
import { loadConfig } from './config/env';
import { connectToDatabase } from './database/db'
import { requestLogger } from './middlewares/requestLogger';
import {connectToRedis} from './utils/redis'

const app = express()
import userRouter from './routes/user.route'
import taskRouter from './routes/task.route'

const server = http.createServer(app)
app.use(express.json({limit:'50kb'}))
app.get('/',(req:Request,res:Response) => {
    res.json('Task manager api working')
})
app.use(requestLogger)
app.use('/api',userRouter)
app.use('/api',taskRouter)
const main = async () => {
    try {
        const config = await loadConfig()
         connectToDatabase();
         await connectToRedis();

        const PORT = Number(config.port) || 3000;

        server.listen(PORT, () => {
            console.log(`Server is listening on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
};
main()
