# Task Management API

A task management API built using Node.js, TypeScript, MongoDB, Redis, and JWT Authentication. This project is designed to handle task creation, user management, and more.

## Features

- User registration and login with JWT authentication.
- Task CRUD operations (Create, Read, Update, Delete).
- Integration with MongoDB for task and user management.
- Redis caching to improve performance for GET /tasks endpoint.
- Dockerized application for easy deployment.

## Technologies Used

- **Node.js** (Backend)
- **TypeScript** (For better developer experience with type safety)
- **MongoDB** (Database)
- **Redis** (Cache)
- **Express.js** (Framework for building RESTful API)
- **JWT** (JSON Web Token for authentication)
- **Docker** (For containerization and easy deployment)

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ab11op/zimozi-task-manager-ts-node.git
cd zimozi-task-manager-ts-node

2. Install Dependencies
npm install

3. Setup Environment Variables
Create environment files for different environments:

.env.development (for local development)
.env.docker (for running on docker)
.env.production (for production environment)
# .env.development

PORT=3000
MONGO_URI=mongodb://<your-mongo-db-uri> (local mongodb uri)
REDIS_URL=redis://<your-redis-url> (local redus url)
JWT_SECRET=your_jwt_secret

# .env.production (Example)

PORT=3000
MONGO_URI=mongo_production_uri
REDIS_URL=redis_production_url
JWT_SECRET=your_jwt_secret

4. Docker Setup 
You can run this application using Docker for local development and deployment.

4.1. Docker Compose
The docker-compose.yml and docker-compose.prod.yml files will help you run the project with Docker. It sets up the Node.js server, MongoDB, and Redis.

# To run locally
docker-compose up --build (uses Dockerfile, .env.docker to run on local docker)

# To run in production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

5. Run the Application
For local development:
npm run dev (uses .env.development(make sure all your local ENVs are there))

API Endpoints
Authentication
POST /api/register
Create a new user.

Request Body:

json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "user"
}
POST /api/login
Login and receive a JWT token.

Request Body:

json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
Response:

json
{
  "token": "<JWT_TOKEN>"
}
Tasks
POST /tasks
Create a new task.

Request Body:

json
{
  "title": "Task Title",
  "description": "Task description",
  "status": "pending",
  "dueDate": "2023-12-31",
  "assignedTo": "<USER_ID>"
}
GET /tasks
Retrieve all tasks with optional filters for status and due date.

Query Parameters:

status: Filter tasks by status (e.g., pending, completed).

dueDate: Filter tasks by due date.

Response:

json
[
  {
    "_id": "<TASK_ID>",
    "title": "Task Title",
    "description": "Task description",
    "status": "pending",
    "dueDate": "2023-12-31",
    "assignedTo": "<USER_ID>"
  }
]
PUT /task/:id
Update an existing task.

Request Body:

json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "completed",
  "dueDate": "2023-12-31",
  "assignedTo": "<USER_ID>"
}
DELETE /tasks/:id
Delete a task.

Deployment
Using Docker
To deploy your application using Docker, you need to have Docker and Docker Compose installed. Once you have the repository cloned, use the following command to start the application:

docker-compose up --build
For production deployment, you can use docker-compose.prod.yml:

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
Using Railway (Cloud Provider)
Create a Railway project.

Connect your GitHub repository.

Set the environment variables in the Railway dashboard (e.g., MONGO_URI, REDIS_URL, JWT_SECRET).

Deploy your app using Railway's build and deploy pipeline.

Running Tests
To run all the test cases:

npm run test
or directly using npx:
npx jest
