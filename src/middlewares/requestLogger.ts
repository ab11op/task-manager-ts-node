import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const { method, originalUrl, body } = req;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}] ${method} ${originalUrl}`);
  
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    console.log('Request Body:', JSON.stringify(body));
  }

  next(); 
};