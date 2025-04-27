

import { createClient } from 'redis';

const redisURL = process.env.REDIS_URL as string

export const redisClient = createClient({
  url: redisURL,
});

export const connectToRedis = async() => {
  try {
    await redisClient.connect()
    console.log('redis connected')
  } catch (error) {
      console.log('error in redis connection',error)
  }
}