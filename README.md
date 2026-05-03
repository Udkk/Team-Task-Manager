<h1 align="center">📋 Task Manager App</h1>

<p align="center">
  <strong>Full-Stack Project Management System</strong><br/>
  Build • Assign • Track • Deliver
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange" />
  <img src="https://img.shields.io/badge/Status-Active-success" />
</p>

---

## ✨ Overview

A scalable **task and project management application** designed to streamline team collaboration.

It provides:
- Secure authentication  
- Role-based access control  
- Task lifecycle tracking  
- Real-time project visibility  

This project demonstrates **full-stack architecture, REST API design, and production-ready practices**.

---

## 🚀 Core Features

- 🔐 Authentication using JWT  
- 👥 Role-based access (**Admin / Member**)  
- 📁 Project creation and member management  
- 📌 Task assignment and lifecycle tracking  
- 🔄 Status workflow: `TODO → IN_PROGRESS → DONE`  
- 📊 Dashboard analytics (total, pending, completed, overdue)  
- 🛡️ Protected routes & secure APIs  

---

## 🧱 Tech Stack

**Frontend**
- React + Vite  
- React Router  
- Axios  
- Tailwind CSS  

**Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT + bcrypt  

---

## 🏗️ Architecture
Client (React) ↓ REST API (Express) ↓ MongoDB Database ↓ Response → UI Update


Copy code

---

## 📂 Project Structure
. ├── client/ # Frontend (React) ├── src/ # Backend (Express) ├── scripts/ # Utilities ├── .env.example └── package.json


Copy code

---

## ⚙️ Getting Started

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd projecttt
2. Install Dependencies
bash

Copy code
npm install
cd client && npm install && cd ..
3. Configure Environment
Create a .env file in root:

env

Copy code
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
4. Run Application
Backend:

bash

Copy code
npm run dev
Frontend:

bash

Copy code
cd client
npm run dev
🔐 API Highlights
Endpoint

Description

/api/auth/login

Authenticate user

/api/projects

Manage projects

/api/tasks

Manage tasks

/api/dashboard

Get analytics

Auth Header:


Copy code
Authorization: Bearer <token>
👥 Roles
Admin

Full system control
Manage users, projects, tasks
Member

View assigned tasks
Update task status
📊 Key Highlights
Clean REST API design
Scalable folder structure
Secure authentication flow
Separation of concerns (MVC pattern)
🚧 Future Improvements
Real-time updates (WebSockets)
Notifications system
Deployment (Docker / Cloud)
Advanced analytics dashboard
📌 Use Cases
Team collaboration tools
Startup task management
Personal productivity systems
👨‍💻 Author
Rahul Yadav
Computer Science Engineering

<div align="center"> <strong>⭐ Star this repo if you found it helpful!</strong> </div>
