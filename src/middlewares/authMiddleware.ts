import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";

export const SECRET_KEY: Secret = process.env.JWT_SECRET as string;

interface CustomJwtPayload extends JwtPayload {
    role: string;
  }
  export interface CustomRequest extends Request {
    token: CustomJwtPayload;
  }

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
  
      if (!token) {
        res.status(StatusCodes.BAD_REQUEST).json({message:'Token not provided'})
        return
      }
  
      const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
      (req as CustomRequest).token = decoded;
  
      next();
    } catch (err) {
        if((err as Error).name === 'TokenExpiredError'){
            res.status(StatusCodes.UNAUTHORIZED).json({message:'Token expired'})
            return
        }
      res.status(StatusCodes.UNAUTHORIZED).send("Please authenticate");
      return
    }
  };

  export const roleCheck = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const customReq = req as CustomRequest;
        const userRole = customReq.token.role;
  
        if (!allowedRoles.includes(userRole)) {
            res.status(StatusCodes.UNAUTHORIZED).json({message:'only admins allowed for this operation'});
            return
        }
  
        next();
      } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send((err as Error).message);
        return
      }
    };
  };