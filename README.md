# TaskForge 

A Jira-style bug and issue management tool built with the MERN stack — track issues, manage projects on a Kanban board, and monitor progress with a real-time analytics dashboard.

🔗 **Live Demo:** [issue-tracker-tawny-nine.vercel.app](https://issue-tracker-tawny-nine.vercel.app/)
🔗 **Backend API:** [taskforge-5mwp.onrender.com](https://taskforge-5mwp.onrender.com)

> ⚠️ Backend is hosted on Render's free tier — the first request after inactivity may take 30-50 seconds to spin up.

### 🔑 Demo Credentials

Try TaskForge instantly with the demo account:

```
Email:    demo@taskforge.com
Password: demo1234
```

## 💡 Why This Project?

Most student projects stop at basic CRUD. TaskForge was built to go further — recreating the core experience of tools like Jira and Linear, including role-based access, a live Kanban workflow, and an analytics dashboard powered by MongoDB aggregation pipelines. The goal was to understand how real issue-tracking systems are structured end-to-end: authentication, data modeling, dashboard analytics, and deployment — not just to build a UI, but to build something that behaves like production software.

## ✨ Features

- 🔐 **Authentication** — secure login/signup with role-based access control (Admin / Member)
- 📋 **Kanban Board** — drag-and-drop issue management across status columns (Open, In Progress, Closed)
- 🎯 **Issue Management** — create, update, assign, and prioritize issues
- 📊 **Analytics Dashboard** — visual insights into project health using MongoDB aggregation pipelines and Recharts
- 👥 **Role-Based Access** — different permissions for admins vs. team members
- 🔍 *(In progress)* Smart filtering by status, priority, and assignee + search bar
- 🕓 *(In progress)* Activity timeline for issue history
- 🎨 *(In progress)* Redesigned issue cards with priority badges and status pills

## 🛠️ Tech Stack

**Frontend:** React, Recharts — deployed on Vercel
**Backend:** Node.js, Express.js — deployed on Render
**Database:** MongoDB Atlas (with aggregation pipelines for analytics)
**Auth:** JWT-based authentication

## 📸 Screenshots

*(Add screenshots or a demo GIF here once available)*

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/Tanishka496/issue-tracker.git
cd issue-tracker

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

**Backend** — create a `.env` file in the `backend` directory:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=10000
```

**Frontend** — create a `.env` file in the `frontend` directory:

```
REACT_APP_API_URL=http://localhost:10000
```

### Running Locally

```bash
# Start backend (from /backend)
npm start

# Start frontend (from /frontend)
npm start
```

Frontend runs at `http://localhost:3000`, backend API at `http://localhost:10000`.

## 📁 Folder Structure

```
issue-tracker/
├── frontend/        # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
├── backend/         # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── README.md
```

## 📡 API Overview

Base URL: `https://taskforge-5mwp.onrender.com/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and receive a JWT token |
| GET | `/projects` | Get all projects for the logged-in user |
| POST | `/projects` | Create a new project |
| GET | `/projects/:id/issues` | Get all issues for a project |
| POST | `/issues` | Create a new issue |
| PUT | `/issues/:id` | Update an issue (status, priority, assignee, etc.) |
| DELETE | `/issues/:id` | Delete an issue |
| GET | `/projects/:id/analytics` | Get aggregated analytics data for a project |

> All routes except `/auth/register` and `/auth/login` require a valid JWT token in the `Authorization` header.

## ☁️ Deployment

- **Frontend** is deployed on [Vercel](https://vercel.com), auto-deployed from the `main` branch, root directory `frontend`.
- **Backend** is deployed on [Render](https://render.com) as a Web Service, root directory `backend`, build command `npm install`, start command `npm start`.
- **Database** is hosted on MongoDB Atlas with network access configured to allow Render's connections.

## 🗺️ Roadmap

- [ ] Smart filtering (status, priority, assignee) + search
- [ ] Activity timeline per project
- [ ] Assign users to issues with avatar display
- [ ] Improved issue card UI
- [ ] Empty state screens

## 👤 Author

**Tanishka K**
Third-year CSE student, Madras Institute of Technology, Anna University

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
