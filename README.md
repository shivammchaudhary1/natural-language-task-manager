# 🤖 AI-Powered Natural Language Task Manager

**Transform Your Words Into Organized Tasks with Google Gemini AI**

A revolutionary, AI-powered task management web application that harnesses the power of **Google's Gemini AI** to intelligently convert natural language into perfectly structured tasks. Built with the modern MERN stack and designed to make task management as simple as typing or speaking naturally.

## ✨ AI-Powered Core Features

🧠 **Google Gemini AI Integration** - Powered by Google's most advanced AI model for superior natural language understanding

🎯 **Intelligent Task Extraction** - Automatically identifies tasks, priorities, deadlines, and assignees from any text

📄 **AI Meeting Minutes Converter** - Upload meeting notes and let AI extract actionable tasks instantly

🔍 **Smart Context Analysis** - AI understands context and relationships between tasks for better organization

⚡ **Real-time AI Processing** - Lightning-fast task conversion with confidence scoring

## 🚀 Complete Feature Set

### 🤖 AI-Powered Features (Google Gemini)

- **Natural Language Processing**: Convert any text into structured tasks using Google's Gemini AI
- **Intelligent Task Parsing**: AI automatically extracts task names, assignees, due dates, priorities, and context
- **Meeting Minutes to Tasks**: Upload meeting notes, emails, or documents and let AI extract actionable items
- **Smart Bulk Processing**: Process multiple tasks from long-form text with intelligent separation
- **Context-Aware Analysis**: AI understands relationships and dependencies between tasks
- **Confidence Scoring**: Each AI-generated task includes a confidence score for transparency

### 💼 Core Application Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload Support**: Upload text files (.txt, .md) for AI-powered bulk task creation
- **Modern UI**: Beautiful, responsive interface built with React, Tailwind CSS, and shadcn/ui
- **Real-time Updates**: Instant task updates and status changes across the application
- **Task Management**: Full CRUD operations - create, edit, delete, and update task statuses
- **Smart Pagination**: Efficient handling of large task lists with pagination
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Date-fns** - Date utility library
- **Sonner** - Toast notifications

### Backend (AI-Powered)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database for task storage
- **Mongoose** - MongoDB ODM
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing
- **🤖 Google Generative AI (Gemini)** - Advanced natural language processing and task extraction
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Multer** - File upload handling for AI processing
- **Zod** - Schema validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Google Gemini API Key**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd natural-language-task-manager
```

### 2. Install Dependencies

#### Backend Dependencies

```bash
cd server
npm install
```

#### Frontend Dependencies

```bash
cd ../client
npm install
```

### 3. Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/nltm
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nltm

# Security Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Rate Limiting Configuration
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000

# 🤖 Google Gemini AI Configuration (REQUIRED)
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Important**: The `GEMINI_API_KEY` is required for the AI-powered task extraction features. Without it, the natural language processing will not work.

#### Frontend Environment Variables (Optional)

Create a `.env` file in the `client` directory if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string and update `MONGO_URI` in `.env`

### 5. 🤖 Google Gemini AI Setup (Essential)

**This application's core functionality depends on Google's Gemini AI. Follow these steps to enable AI-powered task extraction:**

#### Get Your Gemini API Key

1. **Visit Google AI Studio**: Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Sign in**: Use your Google account to sign in
3. **Create API Key**: Click "Create API Key" and select your project
4. **Copy the Key**: Copy your new API key
5. **Add to Environment**: Add it to your `.env` file:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

#### AI Features Enabled by Gemini API

- ✅ **Natural Language Task Parsing**: Convert any text into structured tasks
- ✅ **Meeting Minutes Processing**: Extract action items from meeting notes
- ✅ **Bulk Task Creation**: Process multiple tasks from long-form text
- ✅ **Smart Priority Detection**: AI automatically assigns task priorities
- ✅ **Deadline Extraction**: Identifies and formats due dates from text
- ✅ **Assignee Recognition**: Detects mentioned team members and assigns tasks

> **Note**: Without the Gemini API key, the application will still work for manual task creation, but all AI-powered natural language processing features will be disabled.

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd server
npm start
```

The backend will run on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Mode

#### Build the Frontend

```bash
cd client
npm run build
```

#### Serve Production Build

```bash
npm run preview
```

## 🎯 AI Demo Examples

### See Google Gemini AI in Action

Try these examples to experience the power of AI-driven task extraction:

#### Example 1: Meeting Notes

```
"Yesterday's team meeting covered several action items. Sarah needs to update the user documentation by March 15th. Mike should review the database schema and provide feedback by Thursday. We also need to schedule a follow-up meeting with the client next week, and someone should prepare the quarterly report for the board presentation."
```

**AI Will Extract:**

- ✅ Update user documentation (Assignee: Sarah, Due: March 15th, Priority: Medium)
- ✅ Review database schema (Assignee: Mike, Due: Thursday, Priority: High)
- ✅ Schedule client follow-up meeting (Due: Next week, Priority: Medium)
- ✅ Prepare quarterly report (Priority: High)

#### Example 2: Email Content

```
"Hi team, urgent: we need to fix the login bug by end of day. Also, please remember to test the new payment integration before Friday's release. Don't forget about the code review for the mobile app features."
```

**AI Will Extract:**

- 🚨 Fix login bug (Priority: High, Due: End of day)
- 🧪 Test payment integration (Priority: High, Due: Before Friday)
- 👀 Code review mobile app features (Priority: Medium)

#### Example 3: Project Planning

```
"For the Q2 project, we need to: 1) Conduct user research (high priority), 2) Design wireframes for the new dashboard, 3) Set up the development environment, and 4) Plan the sprint schedule. The research should be done by John before April 1st."
```

**AI Will Extract:**

- 🔍 Conduct user research (Assignee: John, Due: April 1st, Priority: High)
- 🎨 Design wireframes for dashboard (Priority: Medium)
- ⚙️ Set up development environment (Priority: Medium)
- 📅 Plan sprint schedule (Priority: Low)

## 📖 Usage Guide

### 1. User Registration & Login

- Navigate to the application homepage
- Create a new account or login with existing credentials
- All tasks are associated with your user account for privacy and security

### 2. 🤖 AI-Powered Task Creation

#### Method 1: Natural Language Text Input (AI-Powered)

1. Click on "Parse Text" button on your dashboard
2. Paste or type natural language text containing task descriptions. Examples:
   ```
   "I need to finish the presentation by Friday and send the report to John by next week.
   Also, schedule a meeting with the team about the project review."
   ```
3. Submit the text for **Google Gemini AI processing**
4. Review the AI-extracted tasks with confidence scores
5. Edit or confirm the generated tasks

#### Method 2: AI Meeting Minutes to Tasks

1. Click on "Parse Text" button
2. Upload a `.txt` or `.md` file containing meeting notes, emails, or documents
3. **Gemini AI automatically extracts actionable items** from the content
4. Review the intelligent task breakdown with priorities and assignees
5. Bulk import all tasks or select specific ones

#### Method 3: Manual Task Creation

1. Click on "Create Task" button
2. Fill in the task details manually (traditional method)
3. Save the task

### 3. 🎯 AI-Enhanced Task Management

- **Smart Task Display**: AI-generated tasks show confidence scores and source context
- **Intelligent Updates**: Edit AI-suggested tasks with full context awareness
- **Quick Actions**: Use smart filters to view tasks by AI confidence or source
- **Status Management**: Update task statuses with real-time synchronization

### 4. Task Status Management

Tasks can have the following statuses:

- **To Do**: Tasks that haven't been started
- **In Progress**: Tasks currently being worked on
- **Completed**: Finished tasks

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks

### 🤖 AI-Powered Endpoints

- `POST /api/tasks/parse` - **Core AI Feature**: Parse natural language text using Google Gemini AI
  - Converts unstructured text into structured tasks
  - Extracts task names, priorities, assignees, and deadlines
  - Returns confidence scores for each extracted element

### Task Management

- `GET /api/tasks` - Get all tasks (with pagination and AI metadata)
- `POST /api/tasks` - Create a new task manually
- `PUT /api/tasks/:id` - Update a task (including AI-generated tasks)
- `DELETE /api/tasks/:id` - Delete a task

## 🧪 Testing

### Frontend Tests

```bash
cd client
npm test
```

### Backend API Testing

```bash
cd server
chmod +x test-api.sh
./test-api.sh
```

## 📁 Project Structure

```
natural-language-task-manager/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── store/             # State management
│   │   ├── hooks/             # Custom React hooks
│   │   └── lib/               # Utility functions
│   ├── public/                # Static assets
│   └── package.json
├── server/                     # Backend Node.js application
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic services
│   │   ├── middleware/        # Custom middleware
│   │   ├── config/            # Configuration files
│   │   └── validation/        # Input validation schemas
│   └── package.json
├── README.md                   # Project documentation
└── PRD.md                     # Product Requirements Document
```

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet Security**: Security headers for protection
- **Input Validation**: Comprehensive input validation using Zod

## 🌟 Key Components

### Frontend Components

- **TaskList**: Main task display component with pagination
- **CreateTaskDialog**: Manual task creation form
- **ParseTextDialog**: Natural language text input interface
- **UpdateTaskDialog**: Task editing interface
- **TaskStatusUpdateDialog**: Status change confirmation

### Backend Services

- **Gemini Service**: AI-powered natural language processing
- **Task Service**: Task management business logic
- **Auth Service**: User authentication and authorization

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check your `MONGO_URI` in the `.env` file
   - Verify network connectivity for MongoDB Atlas

## 🚀 Deployment Guide

### Production Deployment with AI Features

When deploying to production, ensure all AI features are properly configured:

#### Essential Environment Variables for Production

```env
# 🤖 AI Configuration (CRITICAL)
GEMINI_API_KEY=your_production_gemini_key
NODE_ENV=production

# Database
MONGO_URI=your_production_mongodb_uri

# Security
JWT_SECRET=your_production_jwt_secret

# Server
PORT=5000
```

#### Render.com Deployment (Recommended)

1. **Backend Deployment on Render**:

   - Connect your GitHub repository
   - Set **Root Directory** to `server`
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
   - Add all environment variables including `GEMINI_API_KEY`

2. **Frontend Deployment**:
   - Deploy frontend separately or use static site hosting
   - Update API base URL to point to your deployed backend

#### Vercel Deployment (Alternative)

For serverless deployment with AI features intact:

- Deploy frontend to Vercel
- Deploy backend to Render or Railway
- Ensure GEMINI_API_KEY is configured in production

## 🚨 Troubleshooting

### Common Issues

1. **🤖 AI/Gemini API Errors**

   - **No API Key**: Verify `GEMINI_API_KEY` is set and valid
   - **API Quota Exceeded**: Check your Google AI Studio usage limits
   - **Invalid Requests**: Ensure text input is within Gemini's limits
   - **Network Issues**: Verify server can reach Google AI APIs

2. **MongoDB Connection Error**

   - Ensure MongoDB is running
   - Check your `MONGO_URI` in the `.env` file
   - Verify network connectivity for MongoDB Atlas

3. **Task Parsing Failures**

   - Check if Gemini API key has expired
   - Verify API quota and billing status
   - Test with simpler text input first

4. **CORS Issues**

   - Verify the frontend URL is allowed in CORS configuration
   - Check if both frontend and backend are running

5. **JWT Authentication Issues**
   - Ensure `JWT_SECRET` is set in environment variables
   - Check token expiration settings

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please create an issue in the repository or contact the development team.

## 🔄 Version History

- **v1.0.0**: Initial release with revolutionary AI-powered features
  - 🤖 **Google Gemini AI Integration**: Advanced natural language processing
  - 📝 **AI Task Parsing**: Convert any text into structured tasks
  - 📄 **Meeting Minutes Converter**: AI-powered extraction from documents
  - 🎯 **Smart Priority Detection**: AI automatically assigns task priorities
  - 👥 **Intelligent Assignee Recognition**: AI identifies team members from text
  - ⏰ **Deadline Extraction**: AI finds and formats due dates
  - 🔐 **Secure Authentication**: JWT-based user system
  - 📱 **Modern Responsive UI**: Beautiful interface with Tailwind CSS
  - 🚀 **Full CRUD Operations**: Complete task management system

## 🌟 What Makes This Special

This isn't just another task manager - it's an **AI-first application** that transforms how teams work:

- **🧠 Powered by Google's Most Advanced AI**: Uses Gemini AI for superior natural language understanding
- **⚡ Instant Task Creation**: Turn meeting notes into actionable tasks in seconds
- **🎯 Context-Aware Processing**: AI understands relationships and dependencies
- **📊 Confidence Scoring**: Transparent AI with confidence levels for each extraction
- **🔄 Continuous Learning**: Built to evolve with Google's AI improvements

## 🚀 Ready to Transform Your Workflow?

Experience the future of task management with AI-powered natural language processing. Get started in minutes and see how Google Gemini AI can revolutionize your productivity.

---

**🤖 Built with ❤️ using the MERN stack and Google Gemini AI - The Future of Task Management is Here**
