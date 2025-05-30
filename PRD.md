# Product Requirements Document (PRD)

## Product Title

Natural Language Task Manager (Single User Edition)

## Overview

A modern, intelligent task management web application built on the MERN stack, leveraging shadcn/ui and Tailwind CSS for a sleek, responsive interface. This application empowers a single user to efficiently manage their tasks by directly inputting natural language text, either by copying and pasting content or uploading text files. Natural Language Processing (NLP), powered by the Gemini API, will parse this input into structured task data, which is then saved to the user's database and displayed on the UI. The application prioritizes secure user authentication and authorization using JWT and bcrypt for a personalized task management experience.

## Goals

- Enable a single user to create tasks quickly and intuitively using natural language text input.
- Support task creation from large text dumps (copy-paste) or uploaded text files.
- Automatically extract structured information (task name, assignee, due date, priority) with high accuracy.
- Provide a clean, highly responsive UI for efficient task review, editing, and management.
- Implement secure user authentication and authorization from the outset for a personalized task management experience.

## Key Features

### 1. User Authentication & Authorization

- Secure user registration and login functionality.
- Password hashing using bcrypt.
- Token-based authentication and authorization using JSON Web Tokens (JWT) for secure session management.
- Tasks are directly associated with the logged-in user (createdBy).

### 2. Natural Language Task Creation

#### Input Methods:

- Text Area Input: Users can type or paste large blocks of natural language text into a designated input area.
- File Upload: Users can upload .txt or .md files containing natural language task descriptions. The content of these files will be extracted and processed as text input.

#### Processing Flow:

1. The user submits the text (from text area or uploaded file).
2. This text is sent to the backend.
3. The backend sends the entire text dump to the Gemini API for NLP parsing.
4. Gemini API will parse the input to extract structured task data. It should be capable of identifying multiple tasks within a single large text input.

#### Gemini API Integration Specifications

##### Input Prompt Structure

The system will use a structured prompt with the following components:

```
SYSTEM INSTRUCTION: You are a task extraction assistant that identifies tasks from natural language text and structures them according to specific rules.

USER CONTEXT: The current date and time is {CURRENT_DATE_TIME} in IST (Indian Standard Time). The logged-in user is {USER_NAME}.

USER INPUT: {TEXT_TO_PARSE}

REQUIRED OUTPUT FORMAT: Generate a JSON array where each item represents a task with the following properties:
- taskName: string (concise action)
- assignee: string (defaulting to the logged-in user if not specified)
- dueDate: string (ISO 8601 UTC format converted from IST interpretation)
- priority: string (P1, P2, P3, or P4, defaulting to P3)
- confidence: number (0.0-1.0 indicating parsing confidence)
```

##### Parsing Rules (Explicitly included in prompts)

###### Task Name Extraction

- **Definition**: A concise phrase describing the core action and subject
- **Format**: String, maximum 100 characters
- **Default**: "-" if core action is unclear
- **Examples**:

  - Input: "Need to finish presentation slides and send them to the team by Friday afternoon"
  - Output: "Finish presentation slides"

  - Input: "Call with marketing team about Q3 plans next Monday"
  - Output: "Call with marketing team about Q3 plans"

###### Assignee Resolution

- **Definition**: The person responsible for the task
- **Format**: String (full name preferred, short name accepted)
- **Default**: Current logged-in user
- **Resolution Logic**: Cross-reference with user's contacts list when available
- **Examples**:

  - Input: "Ask Rajeev to prepare sales report"
  - Output: "Rajeev Kumar" (if Rajeev Kumar exists in contacts)

  - Input: "Send files to Aman by tomorrow"
  - Output: "Aman" (if no full name match found)

  - Input: "Need to buy groceries tomorrow"
  - Output: "{LOGGED_IN_USER}" (no assignee specified)

###### Due Date Parsing

- **Definition**: When the task should be completed
- **Format**: ISO 8601 UTC format (e.g., "2025-06-20T18:30:00Z")
- **Timezone Processing**: All user inputs are interpreted as IST and stored as UTC
- **Default Time**: 23:59:59 IST if only date is provided
- **Special Keywords**:
  - "noon" = 12:00:00 PM IST
  - "midnight" = 12:00:00 AM IST (next day)
- **Relative Date Interpretation**:
  - Based on current date: {CURRENT_DATE_TIME}
  - "tomorrow" = next calendar day
  - "next [day]" = next occurrence of specified day
- **Examples**:

  - Input (on May 30, 2025): "Complete project by tomorrow evening"
  - Output: "2025-05-31T18:30:00Z"

  - Input (on May 30, 2025): "Meeting at noon on next Monday"
  - Output: "2025-06-02T06:30:00Z" (12:00 PM IST converted to UTC)

  - Input (on May 30, 2025): "Submit report by June 15"
  - Output: "2025-06-15T18:30:00Z" (23:59:59 IST converted to UTC)

###### Priority Assignment

- **Definition**: Task importance level
- **Format**: String, one of: "P1" (highest), "P2", "P3", "P4" (lowest)
- **Default**: "P3"
- **Interpretation Rules**:
  - P1: Critical, urgent tasks (e.g., "urgent", "ASAP", "critical", "top priority")
  - P2: High importance tasks (e.g., "important", "high priority")
  - P3: Normal tasks (default)
  - P4: Low priority tasks (e.g., "low priority", "when you have time")
- **Examples**:

  - Input: "Urgent: fix the production bug immediately"
  - Output: "P1"

  - Input: "Prepare slides for next week's presentation"
  - Output: "P3" (default)

  - Input: "Low priority: organize old documents when you have time"
  - Output: "P4"

##### Confidence Score

- **Definition**: The AI's confidence in its interpretation (0.0-1.0)
- **Thresholds**:
  - High confidence: 0.8-1.0 (automatically accept)
  - Medium confidence: 0.5-0.79 (flag for review)
  - Low confidence: <0.5 (require manual confirmation)

##### Error Handling

- If parsing fails completely, return an empty array with error message
- For ambiguous interpretations, return multiple options with confidence scores
- For fields with low confidence, use default values and flag for review

#### Example Input-Output

**Input Text:**

```
Need to finish the quarterly report by next Friday. Also, ask Rajeev to prepare the sales presentation for the client meeting on June 15th at noon. I should also remember to buy groceries tomorrow evening.
```

**Expected Output:**

```json
[
  {
    "taskName": "Finish quarterly report",
    "assignee": "John Doe",
    "dueDate": "2025-06-06T18:30:00Z",
    "priority": "P3",
    "confidence": 0.92
  },
  {
    "taskName": "Prepare sales presentation",
    "assignee": "Rajeev Kumar",
    "dueDate": "2025-06-15T06:30:00Z",
    "priority": "P3",
    "confidence": 0.89
  },
  {
    "taskName": "Buy groceries",
    "assignee": "John Doe",
    "dueDate": "2025-05-31T18:30:00Z",
    "priority": "P3",
    "confidence": 0.95
  }
]
```

### 3. Task Display & Editing

- Task list UI with robust sorting by priority and due date.
- Inline task editing will be performed via modals (not directly in-list edits) using shadcn/ui components.
- Ambiguous entries (e.g., tasks with taskName: "-") will be prominently marked with a warning icon or text, prompting the user for correction.
- Tasks flagged with low confidence scores will be visually highlighted for review.

### 4. Ambiguity Handling (for NLP Parsing)

If Gemini returns multiple interpretations for a task (e.g., different due dates or assignees), or if multiple tasks are identified in a single text dump:

- The system will present a confirmation modal or a dedicated review section showing all identified tasks and their parsed details.
- For individual task ambiguities, the most likely interpretation will be pre-selected, and the user can select from up to 3 alternative interpretations presented as radio buttons or distinct selectable options within the review interface.
- The user must review and explicitly confirm all identified tasks before they are saved to the database.
- Confidence thresholds will determine which tasks require confirmation:
  - High confidence (>0.8): Auto-confirm
  - Medium confidence (0.5-0.8): Highlight for quick confirmation
  - Low confidence (<0.5): Require explicit review

## Technical Stack

- Framework: MERN Stack (MongoDB, Express.js, React, Node.js)
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- Authentication & Authorization: JWT (JSON Web Tokens) and Bcrypt
- AI Integration: Gemini API

### Frontend

- React (Vite or CRA for boilerplate)
- Axios for API calls
- lucide-react for icons

### Backend

- Node.js + Express
- MongoDB + Mongoose
- Gemini API integration (for NLP)
- Zod or Joi for validation
- bcrypt.js for password hashing
- jsonwebtoken for authentication tokens

## Design Specifications

- Primary Color: #0C0A3E
- Secondary Color: #326771
- Color Palette: #326771, #551B14, #CAD2C5, #0C0A3E
- Font Family: Roboto

## Data Models

### Task Schema

```typescript
interface Task {
  _id: string;
  taskName: string; // Required, non-empty string
  assignee: string; // Required, default to current user
  dueDate: string; // ISO 8601 UTC format
  priority: "P1" | "P2" | "P3" | "P4"; // Default P3
  createdBy: string; // User ID from authentication
  createdAt: string; // UTC timestamp
  confidence?: number; // AI confidence score (0.0-1.0)
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
}
```

## User Flow

1. User lands on the app.
2. If not authenticated, prompted to Login/Register page.
3. Upon successful login, user is redirected to their task dashboard.
4. User sees a prominent input area (for typing/pasting) and an option to upload .txt or .md files.
5. User inputs text (or uploads file) and initiates parsing.
6. Backend receives text content and sends it to Gemini API for NLP parsing using the structured prompt format.
7. Backend receives parsed task data (potentially multiple tasks) from Gemini.
8. Backend validates the parsed data against the Task schema.
9. Tasks are displayed to the user with confidence scores and highlighting based on confidence thresholds.
10. User reviews each identified task, making any necessary edits or selecting from alternative interpretations.
11. User confirms the batch of tasks.
12. Confirmed tasks are saved to MongoDB (associated with the createdBy user) and immediately rendered in the UI.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Tasks

- `POST /api/tasks/parse` - Send text for NLP parsing
- `POST /api/tasks` - Create new task(s)
- `GET /api/tasks` - Get all tasks for logged-in user
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Milestones

Phase 1: Core Functionality (Authentication, Text Input, Task Parsing & Display)

- User Authentication & Authorization: Implement secure user registration, login, JWT-based authentication, and bcrypt password hashing.
- Frontend Foundation: Setup React project with Tailwind CSS and integrate shadcn/ui components. Implement the specified color palette and Roboto font.
- Text Input: Develop the text input area for typing/pasting and the file upload (.txt, .md) functionality.
- Gemini API Integration: Set up backend integration with Gemini API for NLP parsing of text dumps, capable of identifying multiple tasks.
- Backend Logic: Implement robust backend logic for assignee resolution, and precise IST to UTC date/time conversion (including all specified defaults like 23:59:59 IST, "noon", "midnight", "next Monday").
- Database Integration: Configure MongoDB with Mongoose for single-user task storage.
- Task List UI: Develop the main task list UI with sorting by priority and due date.
- Review & Confirmation UI: Create the comprehensive shadcn/ui confirmation/review modal for all identified tasks, including the display of ambiguous entries with warnings and allowing selection from up to 3 alternatives.

## Success Metrics

- Task creation time < 5s for short text inputs.
- Reliable parsing and display of multiple tasks from large text dumps (e.g., a 1000-word document).
- 90%+ accuracy in NLP parsing and structured data extraction.
- Fully responsive UI on desktop and mobile browsers.
- < 200ms task list rendering time.
- Secure authentication and authorization implementation with no critical vulnerabilities reported.
- Reduction in ambiguous/incorrect task interpretations to <5% of total tasks created.
