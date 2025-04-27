import express,{Request,Response} from 'express'
import http from 'node:http'
import dotenv from 'dotenv'
dotenv.config()
import { connectToDatabase } from './database/db'
import { requestLogger } from './middlewares/requestLogger';
import {connectToRedis} from './utils/redis'

const app = express()
import userRouter from './routes/user.route'
import taskRouter from './routes/task.route'

const server = http.createServer(app)
app.use(express.json({limit:'50kb'}))
app.get('/',(req:Request,res:Response) => {
    res.json('working')
})
app.use(requestLogger)
app.use('/api',userRouter)
app.use('/api',taskRouter)
connectToDatabase()
connectToRedis()
server.listen(3000,()=>{
    console.log('server is up on port 3000')
})