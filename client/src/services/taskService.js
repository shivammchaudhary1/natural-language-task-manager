import api from "./api";

export const taskService = {
  // Get tasks with pagination and filters
  async getTasks(params = {}) {
    const response = await api.get("/tasks", { params });
    return response.data;
  },

  // Create tasks (the backend endpoint creates multiple tasks)
  async createTask(taskData) {
    // Transform the single task data to match backend expectations
    const formattedTask = {
      taskName: taskData.title || taskData.taskName,
      assignee: taskData.assignee || "Current User", // Default assignee if not provided
      dueDate: taskData.dueDate,
      priority: taskData.priority || "P3",
      status: taskData.status || "todo",
      description: taskData.description,
      confidence: taskData.confidence || 1.0,
    };

    // Backend expects tasks array
    const requestBody = {
      tasks: [formattedTask],
    };

    const response = await api.post("/tasks", requestBody);
    return response.data;
  },

  // Bulk create tasks (for AI parsing results)
  async bulkCreateTasks(tasksData) {
    const response = await api.post("/tasks", tasksData);
    return response.data;
  },

  // Parse natural language text (can include file upload)
  async parseText(textData) {
    const response = await api.post("/tasks/parse", textData);
    return response.data;
  },

  // Parse file upload (same endpoint as parseText but with FormData)
  async parseFile(formData) {
    const response = await api.post("/tasks/parse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update task
  async updateTask(taskId, updates) {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // Delete task
  async deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },

  // Get single task
  async getTask(taskId) {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Get task statistics
  async getTaskStats() {
    const response = await api.get("/tasks/stats");
    return response.data;
  },
};
