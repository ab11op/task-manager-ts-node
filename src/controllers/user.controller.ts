import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { loginResponse, userResponse } from "../response";

import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
const JWT_SECRET = process.env.JWT_SECRET as string;
export const userController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, role, password } = req.body;
      if (!email || !name || !role || !password) {
        res
          .status(400)
          .json({ error: "One of email, name, role, or password is missing" });
          return
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      await User.create({ email, name, role, password: hashedPassword });
      res.status(201).json({ message: "User registered" });

    } catch (err) {
      res.status(500).json({ message: "Registration failed", error: (err as Error).message });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const userDoc = await User.findOne({ email }).lean(); // lean() makes it a plain object
      if (!userDoc) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        return;
      }

      // Cast userDoc to userResponse type
      const user: userResponse = {
        name: userDoc.name,
        email: userDoc.email,
        role: userDoc.role,
        password: userDoc.password,
      };

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { userId: userDoc._id, role: user.role }, // userDoc has _id
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log('token',token)

      const response: loginResponse = { token };

      res.status(StatusCodes.OK).json(response);
    } catch (err) {
      console.error(err);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Login failed", error: (err as Error).message });
    }
  },
};
