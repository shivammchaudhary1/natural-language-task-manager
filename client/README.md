# Natural Language Task Manager - Frontend

A modern React application for the Natural Language Task Manager, built with React, Tailwind CSS, shadcn/ui, and Zustand for state management.

## 🚀 Features

### Core Functionality

- **User Authentication**: Secure login/signup with JWT tokens
- **Task Management**: Full CRUD operations for tasks
- **AI-Powered Text Parsing**: Convert natural language to structured tasks
- **File Upload Support**: Parse .txt and .md files to extract tasks
- **Real-time Updates**: Instant task creation and updates

### UI/UX Features

- **Modern Design**: Clean, responsive interface using shadcn/ui components
- **Custom Color Palette**: Midnight blue, teal, burgundy, and sage theme
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode Ready**: Theme system prepared for dark mode
- **Toast Notifications**: Real-time feedback for user actions

### Advanced Features

- **Smart Filtering**: Filter tasks by priority, status, and search
- **Pagination**: Efficient handling of large task lists
- **Confidence Scoring**: AI confidence levels for parsed tasks
- **Bulk Operations**: Create multiple tasks at once
- **Protected Routes**: Secure navigation based on authentication

## 🛠️ Tech Stack

- **React 19** - Latest React with modern features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **Lucide React** - Beautiful icons
- **date-fns** - Date utility library

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── TaskList.jsx     # Task display component
│   ├── CreateTaskDialog.jsx
│   ├── ParseTextDialog.jsx
│   └── ProtectedRoute.jsx
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Authentication
│   ├── Signup.jsx       # User registration
│   └── Dashboard.jsx    # Main application
├── services/            # API services
│   ├── api.js           # Axios configuration
│   ├── authService.js   # Authentication API
│   └── taskService.js   # Task management API
├── store/               # Zustand stores
│   ├── authStore.js     # Authentication state
│   └── taskStore.js     # Task management state
├── hooks/               # Custom React hooks
│   ├── useErrorHandler.js
│   └── useAsync.js
├── lib/                 # Utility libraries
│   └── utils.js         # Common utilities
└── allRoutes/           # Route configuration
    └── AllRoutes.jsx
```

## 🎨 Design System

### Color Palette

- **Primary (Midnight Blue)**: `#0C0A3E` - Main text and headers
- **Secondary (Teal)**: `#326771` - Primary actions and highlights
- **Accent (Burgundy)**: `#551B14` - Important elements and warnings
- **Background (Sage)**: `#CAD2C5` - Background and subtle elements

### Component Hierarchy

1. **Layout Components**: Page wrappers and navigation
2. **UI Components**: Reusable shadcn/ui elements
3. **Feature Components**: Task-specific functionality
4. **Utility Components**: Helpers and providers

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running on port 5001

### Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_FRONTEND_URL=http://localhost:5173
   VITE_BACKEND_URL=http://localhost:5001
   ```

3. **Start Development Server**

   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with name, email, password
2. **Login**: Email/password authentication returns JWT token
3. **Token Storage**: Zustand persist middleware stores auth state
4. **Route Protection**: Protected routes redirect to login if not authenticated
5. **API Authentication**: Axios interceptors add Bearer token to requests
6. **Auto Logout**: Invalid tokens automatically redirect to login

## 📱 Key Features Walkthrough

### 1. Landing Page (`/`)

- Hero section with value proposition
- Feature showcase with icons and descriptions
- Call-to-action buttons for signup/login
- Responsive design with mobile optimization

### 2. Authentication (`/login`, `/signup`)

- Form validation with Zod schemas
- Password visibility toggle
- Error handling with toast notifications
- Automatic redirect after successful auth

### 3. Dashboard (`/dashboard`)

- Task statistics cards
- Search and filter functionality
- Priority-based task organization
- Quick actions for creating and parsing tasks

### 4. Task Management

- **Create Tasks**: Manual task creation with all fields
- **Parse Text**: AI-powered extraction from natural language
- **File Upload**: Support for .txt and .md files
- **Task Actions**: Update status, delete, edit
- **Bulk Operations**: Confirm and create multiple parsed tasks

## 🔄 State Management

### Auth Store (Zustand)

```javascript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  // Actions: setAuth, clearAuth, setLoading, updateUser
}
```

### Task Store (Zustand)

```javascript
{
  tasks: Task[],
  isLoading: boolean,
  error: string | null,
  pagination: PaginationInfo,
  filters: FilterOptions,
  // Actions: CRUD operations, filtering, pagination
}
```

## 🌐 API Integration

### Service Architecture

- **Centralized API Client**: Configured axios instance
- **Service Modules**: Separated by feature (auth, tasks)
- **Error Handling**: Consistent error processing
- **Request Interceptors**: Automatic token attachment
- **Response Interceptors**: Auth error handling

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `GET /api/tasks` - Get tasks with filters
- `POST /api/tasks` - Create single task
- `POST /api/tasks/parse` - Parse natural language
- `POST /api/tasks/parse/file` - Parse uploaded file
- `POST /api/tasks/bulk` - Bulk create tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🎯 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Vite's efficient bundling
- **State Persistence**: Zustand localStorage integration
- **Image Optimization**: Optimized asset loading
- **Component Memoization**: React.memo for expensive components

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Client-side route protection
- **Input Validation**: Zod schemas for all forms
- **XSS Protection**: Sanitized inputs and outputs
- **CORS Configuration**: Proper API security headers

## 🚀 Deployment

### Build Process

```bash
npm run build
```

### Environment Variables

Ensure production environment variables are set:

- `VITE_API_URL` - Production API endpoint
- `VITE_FRONTEND_URL` - Production frontend URL

### Hosting Options

- **Netlify**: Automatic deployment from Git
- **Vercel**: Zero-config React deployments
- **AWS S3**: Static hosting with CloudFront
- **GitHub Pages**: Free hosting for public repos

## 🧪 Testing Strategy

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Task creation and management
- [ ] Text parsing functionality
- [ ] File upload and processing
- [ ] Responsive design on mobile
- [ ] Error handling and notifications

### Future Testing Implementation

- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright
- API integration tests

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ using React, Tailwind CSS, and modern web technologies.
