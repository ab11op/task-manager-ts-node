import * as dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env
process.env.JWT_SECRET = 'test_jwt_secret';
import mongoose from 'mongoose';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../index'; // Import your Express app
import { User } from '../models/user';// Import your User model
import { Task } from '../models/task';
// Function to create a token for a user
const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
};

describe('Admin Task Deletion Tests', () => {
    const SECONDS = 1000;
    jest.setTimeout(70 * SECONDS)
    let adminToken: string;
    let userToken: string;
    let taskId: string;
    let id = new mongoose.Types.ObjectId();
  
    // Before all tests, set up users and create a task
    beforeAll(async () => {
      // Create mock users
      const [adminUser,regularUser] =  await User.insertMany([
        {
          email: 'admin@example.com',
          password: 'password123',
          role: 'admin',
          name: 'Admin User',
        },
        {
          email: 'user@example.com',
          password: 'password123',
          role: 'user',
          name: 'Regular User',
        }
      ]);
  

  
      // Generate JWT tokens for users
      adminToken = generateToken(adminUser._id.toString(), 'admin');
      userToken = generateToken(regularUser._id.toString(), 'user');
  
      // Create a task for testing
      const task = await Task.create({
        title: 'Test Task',
        description: 'This is a test task',
        assignedTo:regularUser._id.toString(),
        dueDate:'2025-04-30T19:49:01.395Z'
      });
      taskId = task._id.toString(); // Save task ID for later use
    });
  
    afterAll(async () => {
      // Clean up test data
      await User.deleteMany({});
      await Task.deleteMany({});
    });
  
    // Test for deleting a task by an admin
    it('should allow admin to delete tasks', async () => {
      const response = await supertest(app)
        .delete(`/api/task/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`); // Admin token
  
      expect(response.status).toBe(200); // Task should be deleted successfully
      expect(response.body.message).toBe('Task deleted successfully');
    });
  
  
    it('should deny access to delete task for regular users', async () => {
      const response = await supertest(app)
        .delete(`/api/task/${taskId}`)
        .set('Authorization', `Bearer ${userToken}`); // Regular user token
  
      expect(response.status).toBe(401); // Forbidden for regular users
      expect(response.body.message).toBe('only admins allowed for this operation');
    });
  
    // Test for trying to delete a non-existent task
    it('should return 404 if the task does not exist', async () => {
      const response = await supertest(app)
        .delete(`/api/tasks/${id}`) // Non-existent task ID
        .set('Authorization', `Bearer ${adminToken}`); // Admin token
  
      expect(response.status).toBe(404); // Task not found
      expect(response.body.message).toBe('Task not found');
    });
  });