import * as redis from 'redis';
// Ensure environment variables are properly typed
const redisHost = process.env.REDIS_HOST as string
const redisPort = Number(process.env.REDIS_PORT)

 export const redisClient = redis.createClient({
    socket: {
        host: redisHost,
        port: redisPort
    }
});

export const connectToRedis = async() => {
    redisClient.connect().then(() => console.log("Redis Connected")).catch(err => console.log('error in redis connection',(err as Error).stack));
}