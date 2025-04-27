

import { createClient } from 'redis';

const redisURL = process.env.REDIS_URL as string

export const redisClient = createClient({
  url: redisURL,
});

export const connectToRedis = async() => {
    redisClient.connect().then(() => console.log("Redis Connected")).catch(err => console.log('error in redis connection',(err as Error).message));
}