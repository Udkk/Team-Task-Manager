<h1 align="center">📋 Task Manager App 🚀</h1>

<p align="center">
  <b>Manage Projects • Track Tasks • Boost Productivity</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Express-green" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## 📌 Overview

A full-stack **task and project management application** built using modern web technologies.  
It enables teams to **organize projects, assign tasks, and track progress efficiently**.

Admins can manage projects, members, and tasks, while members can track and update their assigned work.

---

## 🎯 Features

- 🔐 JWT-based authentication (Signup/Login)
- 🛡️ Protected routes (Dashboard, Projects, Tasks)
- 👥 Role-based access (ADMIN & MEMBER)
- 📁 Project creation & management
- 👤 Project member management
- 📌 Task assignment and tracking
- 🔄 Task workflow:
  - TODO
  - IN_PROGRESS
  - DONE
- 📊 Dashboard statistics:
  - Total tasks
  - Completed
  - Pending
  - Overdue
- ⚡ Modern UI with React + Tailwind CSS
- 🔧 RESTful API with Express & MongoDB

---

## 🏗️ System Architecture

Client (React) → API Requests → Express Server → MongoDB Database → Response → UI Update

---

## 🔧 Technologies

| Category | Tools |
|----------|------|
| Frontend | React, React Router, Axios, Vite, Tailwind CSS |
| Backend  | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth     | JWT, bcrypt |

---

## 📂 Project Structure


.
├── client/
│ └── src/
│ ├── api/
│ ├── components/
│ ├── context/
│ ├── pages/
│ └── routes/
├── scripts/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── app.js
│ └── server.js
├── .env.example
├── package.json
└── README.md


---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js  
- npm  
- MongoDB (local or Atlas)

---

### 2. Clone Repository


git clone <your-repository-url>
cd projecttt
3. Install Dependencies

Backend

npm install

Frontend

cd client
npm install
cd ..
4. Environment Variables

Create a .env file in root:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/express_mongoose_api
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

Frontend config (client/.env):

VITE_API_URL=http://localhost:5000/api
5. Seed Admin User
npm run seed:admin
▶️ How to Run
Start Backend
npm run dev
Start Frontend
cd client
npm run dev
🌐 API Overview

Base URL:
http://localhost:5000

Endpoints
Method	Endpoint	Description	Access
GET	/	Health check	Public
POST	/api/auth/signup	Register user	Public
POST	/api/auth/login	Login	Public
GET	/api/dashboard	Dashboard stats	Auth
GET	/api/projects	Get projects	Auth
POST	/api/projects	Create project	Admin
GET	/api/tasks	Get tasks	Auth
POST	/api/tasks	Create task	Admin
PATCH	/api/tasks/:taskId/status	Update task	Assigned/Admin
DELETE	/api/tasks/:taskId	Delete task	Admin
🔐 Authentication
Authorization: Bearer <token>
👥 Roles
ADMIN
Create projects
Add members
Create & assign tasks
Delete tasks
View all data
MEMBER
View assigned tasks
Update task status
View dashboard
⚠️ Notes
Ensure MongoDB is running before starting backend
Do NOT commit .env file
Commit .env.example instead
🚧 Future Enhancements
🔔 Real-time notifications
📊 Advanced analytics
🌐 Cloud deployment
📱 Mobile responsiveness
📈 Use Cases
Team collaboration
Startup project management
Personal productivity tracking
Academic projects
