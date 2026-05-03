<h1 align="center">📋 Task Manager App 🚀</h1> <p align="center"> <b>Manage Projects • Track Tasks • Boost Productivity</b> </p> <p align="center"> <img src="https://img.shields.io/badge/Frontend-React-blue" /> <img src="https://img.shields.io/badge/Backend-Express-green" /> <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" /> <img src="https://img.shields.io/badge/Auth-JWT-orange" /> <img src="https://img.shields.io/badge/License-MIT-yellow" /> </p>
📌 Overview

A full-stack task and project management application built using modern web technologies.
It enables teams to organize projects, assign tasks, and track progress efficiently.

The system supports:

🔐 Secure authentication
👥 Role-based access control
📊 Real-time task tracking dashboard
🔄 Task workflow management

Admins can manage the entire system, while members can focus on their assigned work.

🎯 Features
🔐 JWT Authentication (Signup/Login)
🛡️ Protected Routes (Dashboard, Projects, Tasks)
👥 Role-Based Access Control (ADMIN & MEMBER)
📁 Project Management
👤 Member Management
📌 Task Assignment & Tracking
🔄 Task Workflow
TODO
IN_PROGRESS
DONE
📊 Dashboard Analytics
Total tasks
Completed
Pending
Overdue
⚡ Modern UI with Tailwind CSS
🔧 RESTful API Architecture
🏗️ System Architecture

Client (React App) → API Requests
Server (Express) → Authentication & Business Logic
MongoDB → Data Storage
JWT → Secure Authorization

Workflow:
User Login → Receive Token → Access Protected Routes → Manage Tasks → Update Status → Dashboard Updates

🔧 Technologies
Category	Tools
Frontend	React, React Router, Axios, Vite, Tailwind CSS
Backend	Node.js, Express
Database	MongoDB, Mongoose
Auth	JSON Web Tokens (JWT), bcrypt
📂 Project Structure
.
├── client/              # React frontend
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── routes/
├── scripts/
├── src/                 # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
⚙️ Setup Instructions
1️⃣ Prerequisites
Node.js
npm
MongoDB (local or Atlas)
2️⃣ Clone Repository
git clone <your-repository-url>
cd projecttt
3️⃣ Install Dependencies

Backend

npm install

Frontend

cd client
npm install
cd ..
4️⃣ Environment Variables

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
5️⃣ Seed Admin User
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
Key Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/signup	Register user	Public
POST	/api/auth/login	Login	Public
GET	/api/dashboard	Dashboard stats	Auth
GET	/api/projects	Get projects	Auth
POST	/api/projects	Create project	Admin
GET	/api/tasks	Get tasks	Auth
POST	/api/tasks	Create task	Admin
PATCH	/api/tasks/:id/status	Update task	Assigned/Admin
DELETE	/api/tasks/:id	Delete task	Admin
🔐 Roles
🛠️ ADMIN
Create projects
Add members
Create & assign tasks
Delete tasks
View all data
👤 MEMBER
View assigned tasks
Update task status
Access dashboard
⚠️ Notes
Ensure MongoDB is running before backend starts
Do not commit .env file
Use .env.example for sharing config
Backend allows requests from:
http://localhost:5173
http://127.0.0.1:5173
🚧 Future Enhancements
🔔 Real-time notifications
📊 Advanced analytics dashboard
🌐 Deployment (Docker / Cloud)
📱 Mobile responsive improvements
📈 Use Cases
Team project management
Startup task tracking
Personal productivity system
Academic project collaboration
👨‍💻 Author

Rahul Yadav
B.Tech / Computer Science
