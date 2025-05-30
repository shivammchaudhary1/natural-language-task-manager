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


# Home Page

![IMG-20250530-WA0003](https://github.com/user-attachments/assets/57864b1d-821f-4e48-b4d6-b51e31ae2166)

The landing page showcasing the application's AI-powered task management capabilities with a clean, modern interface.

# Register

![IMG-20250530-WA0008](https://github.com/user-attachments/assets/db40c58f-2828-4a3f-81c0-08660d7d4751)

# Login

![IMG-20250530-WA0009](https://github.com/user-attachments/assets/d79863be-dbec-45d7-b0b7-ea4901c5d8cd)

# Task Input
![IMG-20250530-WA0007](https://github.com/user-attachments/assets/6fac4520-8f27-4ad4-9450-dca86f496e4b)

Flexible input options - users can either type natural language or upload a text file containing meeting notes or task descriptions.

# Dashbaoard

![IMG-20250530-WA0004](https://github.com/user-attachments/assets/130c6cd2-f282-4703-88db-e1b3d8aa585c)

Main task dashboard displaying organized tasks extracted by AI, with status indicators, due dates, and assignee information.


## 🌟 What Makes This Special

This isn't just another task manager - it's an **AI-first application** that transforms how teams work using Google's Gemini AI to understand natural language and convert it into actionable tasks.

---

**🤖 Built with MERN stack and Google Gemini AI**
