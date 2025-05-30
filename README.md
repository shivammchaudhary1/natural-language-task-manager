# 🤖 AI-Powered Natural Language Task Manager

A task management web application that uses **Google's Gemini AI** to convert natural language into structured tasks. Built with the MERN stack.

## ✨ Key Features

- 🧠 **Google Gemini AI Integration** - Convert natural language into tasks
- 🎯 **Intelligent Task Extraction** - Auto-detect tasks, priorities, deadlines, and assignees
- 📄 **Meeting Minutes to Tasks** - Extract actionable items from meeting notes
- 🔍 **Smart Context Analysis** - Understand relationships between tasks
- 💼 **Complete Task Management** - Create, read, update, delete tasks with status tracking
- 🔒 **Secure Authentication** - JWT-based auth with password hashing

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui, Zustand
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT
- **AI**: Google Generative AI (Gemini)

## ⚙️ Setup Guide

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd natural-language-task-manager

# Backend setup
cd server
npm install

# Frontend setup
cd ../client
npm install
```

2. **Configure environment**

Create `.env` in the `server` and `client` directory:

```Check .env.example file```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/nltm
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d

# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important**: Get your Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Start application**

```bash
# Start backend
cd server
npm run dev

# Start frontend (new terminal)
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5001

## 🎯 Usage Examples

Try these examples with the AI-powered task extraction:

**Meeting notes example:**

```
"Sarah needs to update documentation by March 15th. Mike should review the database schema by Thursday."
```

**AI will extract:**

- Update documentation (Assignee: Sarah, Due: March 15th)
- Review database schema (Assignee: Mike, Due: Thursday)

## 📖 Core Functionality

1. **Natural Language Input**: Type or paste text with tasks
2. **AI Processing**: Gemini AI extracts structured tasks
3. **Task Management**: View, edit, update status of tasks
4. **Organization**: Tasks get proper context, priorities, and deadlines



## 🌟 What Makes This Special

This isn't just another task manager - it's an **AI-first application** that transforms how teams work using Google's Gemini AI to understand natural language and convert it into actionable tasks.

---

**🤖 Built with MERN stack and Google Gemini AI**
