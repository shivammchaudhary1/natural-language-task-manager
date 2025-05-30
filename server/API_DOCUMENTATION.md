# Natural Language Task Manager - API Documentation

## Base URL

```
http://localhost:5001/api
```

## Authentication

All task-related endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

### Get Current User

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

---

## Task Endpoints

### Parse Natural Language Text

**POST** `/tasks/parse`

Parse natural language text or upload a file to extract tasks.

**Option 1: Text Input**

```json
{
  "text": "I need to finish the quarterly report by next Friday. Also, ask Rajeev to prepare the sales presentation for the client meeting."
}
```

**Option 2: File Upload**

```bash
curl -X POST "http://localhost:5001/api/tasks/parse" \
  -H "Authorization: Bearer <token>" \
  -F "file=@meeting-notes.txt"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "taskName": "Finish quarterly report",
        "assignee": "John Doe",
        "dueDate": "2025-06-06T18:59:59.000Z",
        "priority": "P3",
        "confidence": 0.9
      },
      {
        "taskName": "Prepare sales presentation",
        "assignee": "Rajeev",
        "dueDate": "2025-06-02T18:59:59.000Z",
        "priority": "P3",
        "confidence": 0.8
      }
    ],
    "totalTasks": 2
  },
  "message": "Successfully parsed 2 task(s) from text"
}
```

### Create Tasks

**POST** `/tasks`

Create one or multiple tasks.

**Request Body:**

```json
{
  "tasks": [
    {
      "taskName": "Finish quarterly report",
      "assignee": "John Doe",
      "dueDate": "2025-06-06T18:30:00.000Z",
      "priority": "P2",
      "confidence": 0.9
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "...",
        "taskName": "Finish quarterly report",
        "assignee": "John Doe",
        "dueDate": "2025-06-06T18:30:00.000Z",
        "priority": "P2",
        "createdBy": "...",
        "confidence": 0.9,
        "createdAt": "2025-05-30T06:46:10.963Z",
        "updatedAt": "2025-05-30T06:46:10.964Z"
      }
    ],
    "totalCreated": 1
  },
  "message": "Successfully created 1 task(s)"
}
```

### Get All Tasks

**GET** `/tasks`

**Query Parameters:**

- `sortBy` (optional): `dueDate`, `priority`, `createdAt`, `taskName` (default: `dueDate`)
- `sortOrder` (optional): `asc`, `desc` (default: `asc`)
- `priority` (optional): `P1`, `P2`, `P3`, `P4`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page, max 100 (default: 20)

**Examples:**

```
GET /tasks?sortBy=priority&sortOrder=desc
GET /tasks?priority=P1
GET /tasks?page=2&limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "...",
        "taskName": "URGENT: Call the client immediately",
        "assignee": "John Doe",
        "dueDate": "2025-05-31T08:30:00.000Z",
        "priority": "P1",
        "createdBy": "...",
        "confidence": 0.85,
        "createdAt": "2025-05-30T06:46:10.963Z",
        "updatedAt": "2025-05-30T06:48:52.383Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalTasks": 2,
      "hasNextPage": false,
      "hasPrevPage": false,
      "limit": 20
    }
  },
  "message": "Retrieved 2 task(s)"
}
```

### Get Single Task

**GET** `/tasks/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "...",
      "taskName": "Finish quarterly report",
      "assignee": "John Doe",
      "dueDate": "2025-06-06T18:30:00.000Z",
      "priority": "P2",
      "createdBy": "...",
      "confidence": 0.9,
      "createdAt": "2025-05-30T06:46:10.963Z",
      "updatedAt": "2025-05-30T06:46:10.964Z"
    }
  },
  "message": "Task retrieved successfully"
}
```

### Update Task

**PUT** `/tasks/:id`

**Request Body (all fields optional):**

```json
{
  "taskName": "URGENT: Call the client immediately",
  "assignee": "Jane Smith",
  "dueDate": "2025-05-31T14:00:00.000Z",
  "priority": "P1",
  "confidence": 0.95
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "...",
      "taskName": "URGENT: Call the client immediately",
      "assignee": "Jane Smith",
      "dueDate": "2025-05-31T14:00:00.000Z",
      "priority": "P1",
      "createdBy": "...",
      "confidence": 0.95,
      "createdAt": "2025-05-30T06:46:10.963Z",
      "updatedAt": "2025-05-30T06:50:15.123Z"
    }
  },
  "message": "Task updated successfully"
}
```

### Delete Task

**DELETE** `/tasks/:id`

**Response:**

```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "...",
      "taskName": "Buy groceries",
      "assignee": "John Doe",
      "dueDate": "2025-06-01T18:30:00.000Z",
      "priority": "P3",
      "createdBy": "...",
      "confidence": 0.8,
      "createdAt": "2025-05-30T06:46:10.963Z",
      "updatedAt": "2025-05-30T06:46:10.964Z"
    }
  },
  "message": "Task deleted successfully"
}
```

---

## Data Models

### Task Schema

```typescript
interface Task {
  _id: string;
  taskName: string; // Max 100 characters
  assignee: string;
  dueDate: string; // ISO 8601 UTC format
  priority: "P1" | "P2" | "P3" | "P4"; // Default: P3
  createdBy: string; // User ID
  confidence?: number; // 0.0-1.0, default: 1.0
  createdAt: string;
  updatedAt: string;
}
```

### User Schema

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // Hashed
  contacts?: {
    shortName: string;
    fullName: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Priority Levels

- **P1**: Critical/urgent tasks (keywords: urgent, ASAP, critical, top priority)
- **P2**: High importance (keywords: important, high priority)
- **P3**: Normal tasks (default)
- **P4**: Low priority (keywords: low priority, when you have time)

---

## Confidence Scores

- **High confidence (0.8-1.0)**: Clear, unambiguous tasks
- **Medium confidence (0.5-0.79)**: Some ambiguity, might need review
- **Low confidence (<0.5)**: Requires manual confirmation

---

## File Upload Support

- **Supported formats**: `.txt`, `.md`
- **Maximum file size**: 5MB
- **Content type**: `text/plain`, `text/markdown`, `application/octet-stream`

---

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "number",
      "path": ["taskName"],
      "message": "Expected string, received number"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Task not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- **Window**: 15 minutes
- **Max requests**: 1000 per IP per window
- **Applies to**: All `/api/*` routes

---

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/nltm
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=1000
GEMINI_API_KEY=your_gemini_api_key_here
```
