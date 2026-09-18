# 🚀 Task 3 – Persistent Data Layer

A REST API with a persistent PostgreSQL data layer, developed as part of the **Innovation Hacks Full Stack Development Internship**.

This project extends the Users, Projects & Tasks REST API by integrating **PostgreSQL** with **Prisma ORM** for persistent data storage.

---

## 📌 Overview

The application provides a backend REST API for managing:

- 👤 Users
- 📁 Projects
- ✅ Tasks

It includes JWT-based authentication and protected API endpoints. Data is stored persistently in a PostgreSQL database and accessed through Prisma ORM.

---

## ✨ Features

- 🔐 User registration and login
- 🔑 JWT authentication
- 👤 Users management
- 📁 Projects management
- ✅ Tasks management
- 🔗 User–Project–Task relationships
- 🗄️ PostgreSQL database
- ⚙️ Prisma ORM
- 🔄 Prisma database migrations
- 💾 Persistent data storage
- 🔍 Task filtering
- 🌐 RESTful API
- 🧪 API testing using cURL

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| PostgreSQL | Persistent database |
| Prisma | ORM and database migrations |
| JWT | Authentication |
| bcrypt | Password hashing |
| JavaScript | Backend development |
| cURL | API testing |
| Neon | Hosted PostgreSQL database |

---

## 🏗️ Architecture

```text
Client
   │
   ▼
Express.js REST API
   │
   ├── Authentication
   │     ├── Register
   │     └── Login
   │
   ├── Users API
   │
   ├── Projects API
   │
   └── Tasks API
          │
          ▼
      Prisma ORM
          │
          ▼
    PostgreSQL Database
          │
          ▼
    Persistent Storage
📂 Project Structure
Persistent-data-layer/
│
├── middleware/
│   └── auth.js
│
├── prisma/
│   ├── migrations/
│   │   └── 20260916170730_init/
│   │       └── migration.sql
│   └── schema.prisma
│
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── tasks.js
│   └── users.js
│
├── .env.example
├── .gitignore
├── db.js
├── package.json
├── package-lock.json
├── README.md
└── server.js
🗄️ Database

This project uses PostgreSQL as the persistent database.

The database contains three main entities:

User
User
├── id
├── name
├── email
├── password
└── createdAt
Project
Project
├── id
├── name
├── description
├── ownerId
└── createdAt
Task
Task
├── id
├── title
├── description
├── status
├── dueDate
├── projectId
├── assigneeId
└── createdAt
Task Status

Tasks support:

todo
in_progress
done
🔐 Authentication

The API uses JWT (JSON Web Token) authentication.

Users can register and log in to receive an authentication token.

Protected endpoints require:

Authorization: Bearer <YOUR_TOKEN>
Authentication Endpoints
POST /api/auth/register
POST /api/auth/login
🌐 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login and receive JWT
👤 Users
Method	Endpoint	Description
GET	/api/users	Get all users
GET	/api/users/:id	Get user by ID
PATCH	/api/users/:id	Update user
DELETE	/api/users/:id	Delete user
📁 Projects
Method	Endpoint	Description
POST	/api/projects	Create project
GET	/api/projects	Get all projects
GET	/api/projects/:id	Get project by ID
PATCH	/api/projects/:id	Update project
DELETE	/api/projects/:id	Delete project
✅ Tasks
Method	Endpoint	Description
POST	/api/tasks	Create task
GET	/api/tasks	Get all tasks
GET	/api/tasks/:id	Get task by ID
PATCH	/api/tasks/:id	Update task
DELETE	/api/tasks/:id	Delete task
Task Filtering

Tasks can be filtered using:

GET /api/tasks?projectId=1
GET /api/tasks?assigneeId=1
GET /api/tasks?status=in_progress

Multiple filters can also be combined:

GET /api/tasks?projectId=1&assigneeId=1&status=in_progress
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/Asmitha-V/Persistent-data-layer.git

Navigate to the project:

cd Persistent-data-layer
2. Install Dependencies
npm install
3. Configure Environment Variables

Create a .env file in the project root.

Use .env.example as a template.

Example:

PORT=4000
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
DATABASE_URL=your_postgresql_connection_string
⚠️ Security

Never commit .env to GitHub.

Do not expose:

Database passwords
PostgreSQL connection strings
JWT secrets
Authentication tokens

The .env file should remain local.

4. Run Prisma Migration

Apply the database schema:

npx prisma migrate dev --name init

This creates the required database tables and generates the Prisma Client.

5. Start the Server
npm run dev

The API will be available at:

http://localhost:4000
🧪 Testing

The API was tested successfully using cURL with a Neon PostgreSQL database.

Tested Features
✅ API health check
✅ PostgreSQL database connection
✅ Prisma migration
✅ Prisma Client generation
✅ User registration
✅ User login
✅ JWT authentication
✅ Protected Users API
✅ Project creation
✅ Project retrieval
✅ Task creation
✅ Task retrieval
✅ Task status update
✅ Persistent data storage
📊 Example Test Flow
1. Health Check
curl http://localhost:4000

The API returns a successful response containing:

{
  "status": "ok",
  "database": "PostgreSQL via Prisma"
}
2. Register a User
POST /api/auth/register

Example request:

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test12345"
}
3. Login
POST /api/auth/login

Example request:

{
  "email": "test@example.com",
  "password": "Test12345"
}

The API returns a JWT token.

4. Create a Project
POST /api/projects

Example:

{
  "name": "Task 3 Project",
  "description": "Testing persistent data layer"
}
5. Create a Task
POST /api/tasks

Example:

{
  "title": "Complete Task 3",
  "description": "Finish REST API testing",
  "projectId": 1,
  "assigneeId": 1,
  "status": "todo"
}
6. Retrieve Tasks
GET /api/tasks

Example response:

[
  {
    "id": 1,
    "title": "Complete Task 3",
    "description": "Finish REST API testing",
    "status": "todo",
    "projectId": 1,
    "assigneeId": 1
  }
]
7. Update a Task
PATCH /api/tasks/1

Example:

{
  "status": "in_progress"
}

The task status is successfully updated from:

todo

to:

in_progress
🔄 Task 2 → Task 3

Task 3 focuses on replacing the previous local data layer with a persistent PostgreSQL-based solution.

Task 2	Task 3
SQLite	PostgreSQL
Local database	Hosted PostgreSQL
Raw SQL	Prisma ORM
Basic database handling	Prisma Client
No migration workflow	Prisma migrations
Local persistence	Persistent database storage
🔗 Data Relationships

The application connects users, projects, and tasks.

User
 │
 ├──────────────► Projects
 │                    │
 │                    └──────────► Tasks
 │
 └──────────────────────────────► Assigned Tasks

A project has an owner, while tasks are associated with a project and can be assigned to a user.

🎯 Learning Outcomes

Through this project, I gained practical experience in:

PostgreSQL integration
Prisma ORM
Database schema design
Prisma migrations
REST API development
JWT authentication
CRUD operations
Database relationships
API testing
Persistent data storage
Backend project organization
🚀 Future Improvements

Possible improvements include:

Pagination
Advanced filtering and sorting
Role-based access control
Swagger API documentation
Automated testing
Additional validation
Database indexing
Cloud deployment
Frontend integration
💼 Internship
Innovation Hacks — Full Stack Development Internship

Task 3: Persistent Data Layer

This project demonstrates the integration of a persistent PostgreSQL database with a Node.js REST API using Prisma ORM.

🔗 Repository

GitHub Repository:

https://github.com/Asmitha-V/Persistent-data-layer

📌 Project Status
✅ Completed
✅ PostgreSQL Connected
✅ Prisma Migration Applied
✅ JWT Authentication Tested
✅ Users API Tested
✅ Projects API Tested
✅ Tasks API Tested
✅ Persistent Data Verified



👩‍💻 Developer

Asmitha V

B.Tech Information Technology Student
