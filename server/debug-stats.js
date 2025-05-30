import Task from "./src/models/task.model.js";
import "./src/config/db/db.js";

setTimeout(async () => {
  try {
    console.log("=== Database Debug Check ===");

    // Check total tasks
    const totalTasks = await Task.countDocuments({});
    console.log("Total tasks in DB:", totalTasks);

    // Get some sample tasks
    const sampleTasks = await Task.find({}).limit(10);
    console.log("\nSample tasks:");
    sampleTasks.forEach((task, index) => {
      console.log(
        `${index + 1}. "${task.taskName}" - Priority: ${
          task.priority
        }, Status: ${task.status}, Assignee: ${task.assignee}`
      );
    });

    // Check priority distribution
    const priorityStats = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);
    console.log("\nPriority distribution:", priorityStats);

    // Check status distribution
    const statusStats = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    console.log("\nStatus distribution:", statusStats);

    // Check if tasks have createdBy field
    const tasksWithUser = await Task.find({
      createdBy: { $exists: true },
    }).countDocuments();
    const tasksWithoutUser = await Task.find({
      createdBy: { $exists: false },
    }).countDocuments();
    console.log(
      `\nTasks with createdBy: ${tasksWithUser}, Tasks without: ${tasksWithoutUser}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}, 1000);
