import { Role } from "../models/user";
export type loginResponse = {
    token: string;
};

export type userResponse = {
    name: string;
    email: string;
    role:Role
    password:string
}

export type taskResponse = {
    title: string;
    description: string;
    status: string;
    dueDate: Date;
    assignedTo: string;  // Convert ObjectId to string
}