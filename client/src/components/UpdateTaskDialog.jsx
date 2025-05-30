import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { taskService } from "@/services/taskService";
import { useTaskStore } from "@/store/taskStore";

const updateTaskSchema = z.object({
  taskName: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
  status: z.enum(["todo", "in-progress", "completed"]),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

export default function UpdateTaskDialog({
  open,
  onOpenChange,
  task,
  onSuccess,
}) {
  const { updateTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateTaskSchema),
  });

  // Populate form with task data when dialog opens
  useEffect(() => {
    if (task && open) {
      setValue("taskName", task.taskName || task.title || "");
      setValue("description", task.description || "");
      setValue("priority", task.priority || "P3");
      setValue("status", task.status || "todo");
      setValue("assignee", task.assignee || "");

      // Format date for input
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const formattedDate = date.toISOString().split("T")[0];
        setValue("dueDate", formattedDate);
      } else {
        setValue("dueDate", "");
      }
    }
  }, [task, open, setValue]);

  const onSubmit = async (data) => {
    if (!task) return;

    setIsLoading(true);

    const updateData = {
      taskName: data.taskName,
      description: data.description || undefined,
      priority: data.priority,
      status: data.status,
      assignee: data.assignee || undefined,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    try {
      const response = await taskService.updateTask(task._id, updateData);

      // Update with server response
      updateTask(task._id, response.data.task);

      toast.success("Task updated successfully!");
      handleClose();

      // Ensure stats are refreshed after successful update
      setTimeout(() => {
        onSuccess();
      }, 100);
    } catch (error) {
      console.error("Update task error:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-midnight-blue">Update Task</DialogTitle>
          <DialogDescription>
            Modify the task details below. All fields are optional except task
            name.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="taskName"
              className="text-midnight-blue font-medium"
            >
              Task Name *
            </Label>
            <Input
              id="taskName"
              placeholder="Enter task name"
              className="border-teal/30 focus:border-teal"
              {...register("taskName")}
            />
            {errors.taskName && (
              <p className="text-sm text-burgundy">{errors.taskName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-midnight-blue font-medium"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter task description"
              className="border-teal/30 focus:border-teal min-h-[80px]"
              {...register("description")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="priority"
                className="text-midnight-blue font-medium"
              >
                Priority
              </Label>
              <select
                id="priority"
                className="w-full h-10 px-3 py-2 text-sm border border-teal/30 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-teal/50"
                {...register("priority")}
              >
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Medium</option>
                <option value="P4">P4 - Low</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-midnight-blue font-medium"
              >
                Status
              </Label>
              <select
                id="status"
                className="w-full h-10 px-3 py-2 text-sm border border-teal/30 rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-teal/50"
                {...register("status")}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="dueDate"
                className="text-midnight-blue font-medium"
              >
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="border-teal/30 focus:border-teal"
                {...register("dueDate")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="assignee"
                className="text-midnight-blue font-medium"
              >
                Assignee
              </Label>
              <Input
                id="assignee"
                placeholder="Enter assignee name or email"
                className="border-teal/30 focus:border-teal"
                {...register("assignee")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-teal/30 text-midnight-blue"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-teal hover:bg-teal/90 text-white"
            >
              {isLoading ? "Updating..." : "Update Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
