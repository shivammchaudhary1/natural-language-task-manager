import { z } from "zod";

// Task validation schema
export const taskSchema = z.object({
  taskName: z
    .string()
    .min(1, "Task name is required")
    .max(100, "Task name cannot be more than 100 characters")
    .trim(),
  assignee: z.string().min(1, "Assignee is required").trim(),
  dueDate: z.string().datetime("Invalid date format"),
  priority: z.enum(["P1", "P2", "P3", "P4"]).default("P3"),
  status: z.enum(["todo", "in-progress", "completed"]).default("todo"),
  description: z
    .string()
    .max(500, "Description cannot be more than 500 characters")
    .trim()
    .optional(),
  confidence: z.number().min(0.0).max(1.0).optional().default(1.0),
});

// Task creation validation (array of tasks)
export const createTasksSchema = z.object({
  tasks: z
    .array(taskSchema)
    .min(1, "At least one task is required")
    .max(50, "Cannot create more than 50 tasks at once"),
});

// Task update validation
export const updateTaskSchema = z.object({
  taskName: z
    .string()
    .min(1, "Task name is required")
    .max(100, "Task name cannot be more than 100 characters")
    .trim()
    .optional(),
  assignee: z.string().min(1, "Assignee is required").trim().optional(),
  dueDate: z.string().datetime("Invalid date format").optional(),
  priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
  status: z.enum(["todo", "in-progress", "completed"]).optional(),
  description: z
    .string()
    .max(500, "Description cannot be more than 500 characters")
    .trim()
    .optional(),
  confidence: z.number().min(0.0).max(1.0).optional(),
});

// Text parsing validation
export const parseTextSchema = z.object({
  text: z
    .string()
    .min(1, "Text input is required")
    .max(10000, "Text input cannot be more than 10,000 characters"),
});

// Query validation for getting tasks
export const getTasksQuerySchema = z.object({
  sortBy: z
    .enum(["dueDate", "priority", "createdAt", "taskName"])
    .optional()
    .default("dueDate"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
  page: z.coerce
    .number()
    .min(1, "Page must be greater than 0")
    .optional()
    .default(1),
  limit: z.coerce
    .number()
    .min(1, "Limit must be greater than 0")
    .max(100, "Limit cannot be more than 100")
    .optional()
    .default(20),
});
