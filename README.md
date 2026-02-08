# SkillBridge 🚀

**SkillBridge** is a full-stack project management and skills platform designed to streamline collaboration and showcase professional portfolios. Built with the MERN stack (MongoDB, Express, React, Node.js), it features secure authentication, role-based access control, and a premium user interface.

## 📚 Documentation

For detailed information about the project, please refer to the documents in the `docs` folder:

- **[Project Documentation (PDF)](docs/SkillBridge_Project_Documentation.pdf)** - Comprehensive overview of features, tech stack, and architecture.
- **[Software Requirements Specification (PDF)](docs/SkillBridge_SRS.pdf)** - Detailed requirements and specifications.
- **[LinkedIn Post Drafts](docs/LinkedIn_Post.md)** - Ready-to-use social media content.

## 🌟 Features

- **Authentication**: Secure JWT-based registration and login with HttpOnly cookies.
- **RBAC**: Distinct roles for Users and Admins.
- **Project Management**: Create, edit, delete, and list projects with filter capabilities.
- **Dashboard**: personalized view of active projects and stats.
- **Modern UI**: Built with Tailwind CSS, Framer Motion, and Glassmorphism design principles.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.
- **Dev Tools**: ESLint, Postman.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas URI)

### Installation

1. **Clone the repository** (if applicable).

2. **Backend Setup**
   ```bash
   cd SkillBridge/server
   npm install
   # Create a .env file with your variables (see .env.example or below)
   # PORT=5000
   # MONGO_URI=mongodb://localhost:27017/skillbridge
   # JWT_SECRET=your_secret_key
   # GOOGLE_CLIENT_ID=... (Optional for Google Login)
   # GOOGLE_CLIENT_SECRET=... (Optional)
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd SkillBridge/client
   npm install
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```
SkillBridge/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI & Layouts
│   │   ├── context/        # Auth Context
│   │   ├── pages/          # Application Views
│   │   └── App.jsx         # Routes
├── server/                 # Backend (Node + Express)
│   ├── src/
│   │   ├── controllers/    # Route Logic
│   │   ├── middleware/     # Auth & RBAC
│   │   ├── models/         # Mongoose Schemas
│   │   └── routes/         # API Endpoints
```

## 🔐 API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- **Projects**: `/api/projects` (GET, POST), `/api/projects/:id` (PUT, DELETE)

## 🧪 Running Tests
(Coming Soon)

## 📄 License
MIT
