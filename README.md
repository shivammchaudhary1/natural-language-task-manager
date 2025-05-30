# Natural Language Task Manager

A modern, intelligent task management web application that allows users to create and manage tasks using natural language text input. Built with the MERN stack (MongoDB, Express.js, React, Node.js) and powered by Google's Gemini AI for natural language processing.

## 🚀 Features

- **Natural Language Processing**: Convert plain text into structured tasks using AI
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload Support**: Upload text files (.txt, .md) for bulk task creation
- **Smart Task Extraction**: Automatically extract task names, assignees, due dates, and priorities
- **Modern UI**: Built with React, Tailwind CSS, and shadcn/ui components
- **Real-time Updates**: Instant task updates and status changes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Task Management**: Create, edit, delete, and update task statuses
- **Pagination**: Efficient handling of large task lists

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

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Google Generative AI** - Natural language processing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **Multer** - File upload handling
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

# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
```

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

### 5. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key and add it to your `.env` file as `GEMINI_API_KEY`

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

## 📖 Usage Guide

### 1. User Registration & Login

- Navigate to the application homepage
- Create a new account or login with existing credentials
- All tasks are associated with your user account

### 2. Creating Tasks

#### Method 1: Natural Language Text Input

1. Click on "Parse Text" button
2. Paste or type natural language text containing task descriptions
3. Submit the text for AI processing
4. Review and confirm the extracted tasks

#### Method 2: File Upload

1. Click on "Parse Text" button
2. Upload a `.txt` or `.md` file containing task descriptions
3. The file content will be processed by AI
4. Review and confirm the extracted tasks

#### Method 3: Manual Task Creation

1. Click on "Create Task" button
2. Fill in the task details manually
3. Save the task

### 3. Managing Tasks

- **View Tasks**: All tasks are displayed in a paginated list
- **Update Status**: Use quick action buttons to change task status
- **Edit Tasks**: Click the edit button to modify task details
- **Delete Tasks**: Click the delete button to remove tasks
- **Filter/Search**: Use filters to find specific tasks

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

- `GET /api/tasks` - Get all tasks (with pagination)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/parse` - Parse natural language text into tasks

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

2. **Gemini API Errors**

   - Verify your `GEMINI_API_KEY` is correct
   - Check API quota limits
   - Ensure the API key has proper permissions

3. **CORS Issues**

   - Verify the frontend URL is allowed in CORS configuration
   - Check if both frontend and backend are running

4. **JWT Authentication Issues**
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

- **v1.0.0**: Initial release with core functionality
  - Natural language task parsing
  - User authentication
  - Task management CRUD operations
  - Modern responsive UI

---

**Built with ❤️ using the MERN stack and AI-powered natural language processing**
