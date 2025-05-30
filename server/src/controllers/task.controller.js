import Task from "../models/task.model.js";
import User from "../models/user.model.js";
import { parseTasksFromText } from "../services/gemini.service.js";
import {
  parseTextSchema,
  createTasksSchema,
  updateTaskSchema,
  getTasksQuerySchema,
} from "../validation/task.validation.js";

/**
 * Parse natural language text to extract tasks
 * @route POST /api/tasks/parse
 */
export const parseText = async (req, res) => {
  try {
    // Validate input
    const { text } = parseTextSchema.parse(req.body);

    // Get user details with contacts
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Parse tasks using Gemini AI
    const parsedTasks = await parseTasksFromText(
      text,
      user.name,
      user.contacts || []
    );

    if (parsedTasks.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          tasks: [],
          totalTasks: 0,
          totalCreated: 0,
        },
        message: "No tasks could be extracted from the text",
      });
    }

    // Add createdBy to each task and save to database
    const tasksWithUser = parsedTasks.map((task) => ({
      ...task,
      createdBy: req.user.userId,
    }));

    // Create tasks in bulk
    const createdTasks = await Task.insertMany(tasksWithUser);

    res.status(201).json({
      success: true,
      data: {
        tasks: createdTasks,
        totalTasks: createdTasks.length,
        totalCreated: createdTasks.length,
      },
      message: `Successfully parsed and created ${createdTasks.length} task(s) from text`,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Parse text error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error parsing text",
    });
  }
};

/**
 * Create new tasks
 * @route POST /api/tasks
 */
export const createTasks = async (req, res) => {
  try {
    // Validate input
    const { tasks } = createTasksSchema.parse(req.body);

    // Add createdBy to each task
    const tasksWithUser = tasks.map((task) => ({
      ...task,
      createdBy: req.user.userId,
    }));

    // Create tasks in bulk
    const createdTasks = await Task.insertMany(tasksWithUser);

    res.status(201).json({
      success: true,
      data: {
        tasks: createdTasks,
        totalCreated: createdTasks.length,
      },
      message: `Successfully created ${createdTasks.length} task(s)`,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Create tasks error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating tasks",
    });
  }
};

/**
 * Get all tasks for logged-in user
 * @route GET /api/tasks
 */
export const getTasks = async (req, res) => {
  try {
    // Validate query parameters
    const { sortBy, sortOrder, priority, page, limit } =
      getTasksQuerySchema.parse(req.query);

    // Build filter
    const filter = { createdBy: req.user.userId };
    if (priority) {
      filter.priority = priority;
    }

    // Build sort object
    const sort = {};
    if (sortBy === "priority") {
      // Custom priority sorting: P1 > P2 > P3 > P4
      const priorityOrder = { P1: 1, P2: 2, P3: 3, P4: 4 };
      sort.priority = sortOrder === "asc" ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get tasks with pagination
    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Task.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalTasks / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
      message: `Retrieved ${tasks.length} task(s)`,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching tasks",
    });
  }
};

/**
 * Update a task
 * @route PUT /api/tasks/:id
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input
    const updateData = updateTaskSchema.parse(req.body);

    // Find and update task (only if it belongs to the user)
    const task = await Task.findOneAndUpdate(
      { _id: id, createdBy: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
      message: "Task updated successfully",
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating task",
    });
  }
};

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete task (only if it belongs to the user)
    const task = await Task.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
      message: "Task deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting task",
    });
  }
};

/**
 * Get a single task by ID
 * @route GET /api/tasks/:id
 */
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task (only if it belongs to the user)
    const task = await Task.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to view it",
      });
    }

    res.status(200).json({
      success: true,
      data: { task },
      message: "Task retrieved successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching task",
    });
  }
};

/**
 * Parse natural language text and create tasks in database
 * @route POST /api/tasks/parse-and-create
 */
export const parseAndCreateTasks = async (req, res) => {
  try {
    // Validate input
    const { text } = parseTextSchema.parse(req.body);

    // Get user details with contacts
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Parse tasks using Gemini AI
    const parsedTasks = await parseTasksFromText(
      text,
      user.name,
      user.contacts || []
    );

    if (parsedTasks.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          tasks: [],
          totalCreated: 0,
        },
        message: "No tasks could be extracted from the text",
      });
    }

    // Add createdBy to each task and save to database
    const tasksWithUser = parsedTasks.map((task) => ({
      ...task,
      createdBy: req.user.userId,
    }));

    // Create tasks in bulk
    const createdTasks = await Task.insertMany(tasksWithUser);

    res.status(201).json({
      success: true,
      data: {
        tasks: createdTasks,
        totalCreated: createdTasks.length,
        parsedCount: parsedTasks.length,
      },
      message: `Successfully parsed and created ${createdTasks.length} task(s)`,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error("Parse and create tasks error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error parsing and creating tasks",
    });
  }
};

/**
 * Get task statistics
 * @route GET /api/tasks/stats
 */
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total task count
    const totalTasks = await Task.countDocuments({ createdBy: userId });

    // Get priority statistics
    const priorityStats = await Task.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Get status statistics
    const statusStats = await Task.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Format the response
    const stats = {
      total: totalTasks,
      priority: {
        P1: 0,
        P2: 0,
        P3: 0,
        P4: 0,
      },
      status: {
        todo: 0,
        "in-progress": 0,
        completed: 0,
      },
    };

    // Map priority stats
    priorityStats.forEach((stat) => {
      if (stat._id && stats.priority.hasOwnProperty(stat._id)) {
        stats.priority[stat._id] = stat.count;
      }
    });

    // Map status stats
    statusStats.forEach((stat) => {
      if (stat._id && stats.status.hasOwnProperty(stat._id)) {
        stats.status[stat._id] = stat.count;
      }
    });

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task statistics",
    });
  }
};
