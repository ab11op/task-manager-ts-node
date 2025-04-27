import * as dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env
process.env.JWT_SECRET = 'test_jwt_secret';
import request from 'supertest';
import { app } from '../index';  // IMPORTANT: src/, not dist/
import bcrypt from 'bcryptjs'
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from '../models/user'; // Path to your User model
import { Task } from '../models/task';
import mongoose from 'mongoose';
let mongo: MongoMemoryServer;
let userId:string

beforeAll(async () => {
  // Start an in-memory MongoDB instance
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  
  // Connect mongoose to the in-memory database
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash('password123', 10);
  const newUser = new User({
    email: 'user@example.com',
    password: passwordHash,
    role:'user',
    name:'Akash'
  });
  const savedUser = await newUser.save();
  userId = savedUser._id.toString();
});

afterEach(async () => {
  // Cleanup: Drop all collections after each test
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Close connection to the in-memory DB and stop the server
  await mongoose.connection.close();
  await mongo.stop();
});



describe(' User Login', () => {
    it('should return 401 if user does not exist', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistentuser@example.com',
          password: 'password123',
        });
      
      expect(res.statusCode).toBe(401);  // Unauthorized
      expect(res.body.message).toBe('Invalid credentials');
    });
  
    it('should return 401 if password is incorrect', async () => {
      // Create a user in the in-memory DB with a hashed password
      const passwordHash = await bcrypt.hash('password123', 10);
      const newUser = new User({
        email: 'existinguser@example.com',
        password: passwordHash,
        role:"user",
        name:'Akash'
      });
      await newUser.save();
  
      // Try to login with incorrect password
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'existinguser@example.com',
          password: 'wrongpassword',  // Wrong password
        });
      
      expect(res.statusCode).toBe(401);  // Unauthorized
      expect(res.body.message).toBe('Invalid credentials');
    });
  
    it('should return 200 and a token if login is successful', async () => {
      // Create a user in the in-memory DB with a hashed password
      const passwordHash = await bcrypt.hash('password123', 10);
      const newUser = new User({
        email: 'existinguser@example.com',
        password: passwordHash,
        role:'user',
        name:'Akash'
      });
      await newUser.save();
  
      // Try to login with correct credentials
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'existinguser@example.com',
          password: 'password123',  // Correct password
        });
      
      expect(res.statusCode).toBe(200);  // Success
      expect(res.body).toHaveProperty('token');  // Expect a token to be returned
      expect(typeof res.body.token).toBe('string');  // Token should be a string
    });
  });

// describe('Task Creation and Retrieval', () => {
  
//     it('should create a new task successfully', async () => {
//       const res = await request(app)
//         .post('/api/tasks')
//         .send({
//           title: 'Test Task',
//           description: 'This is a test task',
//           assignedTo: userId,
//           dueDate:'2025-04-30T19:49:01.395Z'
//         })
//          // Expect the status code to be 201 (Created)
      
//       // Check that the task was created correctly
//       expect(res.statusCode).toBe(201);  
//       expect(res.body).toHaveProperty('_id');
//       expect(res.body.title).toBe('Test Task');
//       expect(res.body.description).toBe('This is a test task');
//       expect(res.body.assignedTo).toBe(userId);
//     });
  
//     it('should retrieve all tasks', async () => {
//       // Create a new task in the in-memory DB
//       await Task.create({
//         title: 'Task 1',
//         description: 'This is the first task',
//         assignedTo: userId,
//         dueDate:'2025-04-30T19:49:01.395Z'
//       });
  
//       await Task.create({
//         title: 'Task 2',
//         description: 'This is the second task',
//         assignedTo: userId,
//         dueDate:'2025-04-30T19:49:01.395Z'
//       });
  
//       // Retrieve all tasks
//       const res = await request(app)
//         .get('/api/tasks')
//         .expect(200);  // Expect the status code to be 200 (OK)
  
//       // Check that the response contains tasks
//       expect(res.body).toHaveLength(2);
//       expect(res.body[0]).toHaveProperty('_id');
//       expect(res.body[0].title).toBe('Task 1');
//       expect(res.body[1].title).toBe('Task 2');
//     });
  
//     it('should retrieve a task by ID', async () => {
//       // Create a new task in the in-memory DB
//       const task = await Task.create({
//         title: 'Task 1',
//         description: 'This is the first task',
//         assignedTo: userId,
//         dueDate:'2025-04-30T19:49:01.395Z'
//       });
  
//       // Retrieve the task by ID
//       const res = await request(app)
//         .get(`/api/task/${task._id}`)
//         .expect(200);  // Expect the status code to be 200 (OK)
  
//       // Check that the correct task is retrieved
//       expect(res.body).toHaveProperty('_id');
//       expect(res.body._id).toBe(task._id.toString());
//       expect(res.body.title).toBe('Task 1');
//       expect(res.body.description).toBe('This is the first task');
//     });
  
//   });




