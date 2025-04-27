import { Schema, model, connect } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
export enum Role{
    USER = 'user',
    ADMIN = 'admin'
}
 interface IUser {
  name: string;
  email: string;
  role:Role
  password:string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role:{
    type: String,
    enum: Object.values(Role),
    required:true
  },
  password: { type: String, required: true },
  
});

// 3. Create a Model.
export const User = model<IUser>('User', userSchema);
