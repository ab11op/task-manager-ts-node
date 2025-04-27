import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

import { StatusCodes } from 'http-status-codes';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
      const errorMessages = error.errors.map((issue: any) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }))
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
      }
    }
  };
}

export const validateQuery = (schema: z.ZodObject<any, any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const parseResult = schema.safeParse(req.query);
  
      if (!parseResult.success) {
         res.status(400).json({ errors: parseResult.error.flatten() });
         return
      }
  
      // Extend Request type to include validatedQuery
      (req as Request & { validatedQuery: typeof parseResult.data }).validatedQuery = parseResult.data;
      next();
    };
  };