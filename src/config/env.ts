export const loadConfig = async () => {
  return {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || "",
    redisUrl: process.env.REDIS_URL || "",
    jwtSecret: process.env.JWT_SECRET || "",
  };
};
