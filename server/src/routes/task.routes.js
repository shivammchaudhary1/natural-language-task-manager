import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
  parseText,
  parseAndCreateTasks,
  createTasks,
  getTasks,
  updateTask,
  deleteTask,
  getTask,
  getTaskStats,
} from "../controllers/task.controller.js";

const taskRouter = express.Router();

// Configure multer for file uploads (text files only)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow text files
    const allowedMimeTypes = [
      "text/plain",
      "text/markdown",
      "application/octet-stream", // Sometimes .txt files have this mime type
    ];

    const allowedExtensions = [".txt", ".md"];
    const fileExtension = file.originalname
      .toLowerCase()
      .slice(file.originalname.lastIndexOf("."));

    if (
      allowedMimeTypes.includes(file.mimetype) ||
      allowedExtensions.includes(fileExtension)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .txt and .md files are allowed"), false);
    }
  },
});

// Middleware to handle file upload and extract text
const handleFileUpload = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB.",
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }

    // If file is uploaded, extract text from buffer
    if (req.file) {
      try {
        const textContent = req.file.buffer.toString("utf-8");
        req.body.text = textContent;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Failed to read file content",
        });
      }
    }

    next();
  });
};

// All routes require authentication
taskRouter.use(protect);

// Task routes
taskRouter.post("/parse", handleFileUpload, parseText);
taskRouter.post("/parse-and-create", handleFileUpload, parseAndCreateTasks);
taskRouter.post("/", createTasks);
taskRouter.get("/stats", getTaskStats);
taskRouter.get("/", getTasks);
taskRouter.get("/:id", getTask);
taskRouter.put("/:id", updateTask);
taskRouter.delete("/:id", deleteTask);

export default taskRouter;
