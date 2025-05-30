import mongoose from "mongoose";

// NOTE: Gemini AI needs data in this JSON format
const taskSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: [true, "Please provide a task name"],
      trim: true,
      maxLength: [100, "Task name cannot be more than 100 characters"],
    },
    assignee: {
      type: String,
      required: [true, "Please provide an assignee"],
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide a due date"],
    },
    priority: {
      type: String,
      enum: ["P1", "P2", "P3", "P4"],
      default: "P3",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, "Description cannot be more than 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be associated with a user"],
    },
    confidence: {
      type: Number,
      min: 0.0,
      max: 1.0,
      default: 1.0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false, // Disable __v field
  }
);

// Index for better query performance
taskSchema.index({ createdBy: 1, dueDate: 1 });
taskSchema.index({ createdBy: 1, priority: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;
