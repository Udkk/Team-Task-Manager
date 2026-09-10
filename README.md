# 📋 Team Task Manager

<p align="center">
  <strong>Full-Stack Project Management System</strong><br/>
  Build • Assign • Track • Deliver
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange" />
  <img src="https://img.shields.io/badge/Status-Deployed-success" />
</p>

---

## ✨ Overview

**Team Task Manager** is a full-stack project and task management application designed to simplify team collaboration and task tracking.

The application provides:

* 🔐 Secure user authentication
* 👥 Role-based access control
* 📁 Project and member management
* 📌 Task assignment and tracking
* 🔄 Task status workflow
* 📊 Dashboard analytics
* 🛡️ Protected API routes

The project demonstrates a complete **React + Node.js + Express + MongoDB** architecture with JWT-based authentication and role-based authorization.

---

## 🚀 Core Features

* 🔐 JWT-based authentication
* 👥 Role-based access control (**Admin / Member**)
* 📁 Project creation and member management
* 📌 Task creation and assignment
* 🔄 Task workflow: `TODO → IN_PROGRESS → DONE`
* 📊 Dashboard analytics:

  * Total tasks
  * Pending tasks
  * Completed tasks
  * Overdue tasks
* 🛡️ Protected routes and APIs
* 🔒 Password hashing using bcrypt
* ☁️ Deployed frontend and backend

---

## 🧱 Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt

### Deployment

* Render
* MongoDB Atlas

---

## 🏗️ Architecture

```text
┌─────────────────────┐
│   React Frontend    │
│      Vite + UI      │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│   Express Backend   │
│   Node.js + JWT     │
└──────────┬──────────┘
           │
           │ Mongoose
           ▼
┌─────────────────────┐
│    MongoDB Atlas    │
│      Database       │
└─────────────────────┘
```

---

## 📂 Project Structure

```text
Team-Task-Manager/
│
├── client/                  # React + Vite frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── scripts/
│   └── seedAdmin.js         # Admin initialization
│
├── src/                     # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Udkk/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=8080

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_jwt_secret

CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_admin_password
```

> ⚠️ Never commit your `.env` file or real credentials to GitHub.

### 5. Run the Backend

From the project root:

```bash
npm run dev
```

### 6. Run the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔐 Authentication & Authorization

The application uses **JWT authentication** to secure protected routes.

After successful login, the server returns a JWT token which is used to authenticate subsequent API requests.

Example:

```http
Authorization: Bearer <token>
```

Passwords are securely hashed using **bcrypt** before being stored in MongoDB.

---

## 🔌 API Highlights

| Endpoint                | Description                  |
| ----------------------- | ---------------------------- |
| `POST /api/auth/login`  | Authenticate a user          |
| `POST /api/auth/signup` | Register a new user          |
| `/api/projects`         | Manage projects              |
| `/api/tasks`            | Manage tasks                 |
| `/api/dashboard`        | Retrieve dashboard analytics |
| `/api/users`            | Manage users                 |
| `GET /api/health`       | Check API status             |

---

## 👥 Roles

### 🛠️ Admin

Admins have elevated access to the system and can:

* Manage users
* Create and manage projects
* Manage project members
* Manage tasks
* Access administrative functionality

### 👤 Member

Members can:

* Access their assigned projects
* View assigned tasks
* Update task status
* Track their task progress

---

## 📊 Dashboard

The dashboard provides an overview of task activity, including:

* Total tasks
* Pending tasks
* Completed tasks
* Overdue tasks
* Project and task information

This gives teams a centralized view of their current workload and progress.

---

## ☁️ Deployment

The application is deployed using:

* **Frontend:** Render Static Site
* **Backend:** Render Web Service
* **Database:** MongoDB Atlas

### Backend API

```text
https://team-task-manager-92sv.onrender.com
```

### Health Check

```text
https://team-task-manager-92sv.onrender.com/api/health
```

The health endpoint can be used to verify that the deployed backend is running.

---

## ⭐ Key Highlights

* Clean REST API architecture
* MVC-based backend structure
* JWT authentication
* Role-based authorization
* Secure password hashing
* MongoDB database integration
* Protected API routes
* React-based responsive frontend
* Separate frontend and backend deployment
* Cloud-hosted MongoDB database
* Environment-based configuration

---

## 🚧 Future Improvements

* 🔄 Real-time updates using WebSockets
* 🔔 Notification system
* 📈 More advanced analytics
* 👥 Multiple teams with isolated team-level administration
* 📅 Task deadlines and calendar integration
* 📎 File attachments for tasks

---

## 📌 Use Cases

* Team collaboration
* Software project management
* Startup task management
* Academic project coordination
* Personal productivity
* Small-team workflow management

---

## 👨‍💻 Author

**Udit Kumar**

Computer Science Engineering Student

---

<p align="center">
  <strong>⭐ If you found this project useful, consider starring the repository!</strong>
</p>
