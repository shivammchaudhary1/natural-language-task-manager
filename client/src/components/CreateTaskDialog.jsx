import React, { useState } from "react";
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

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
  status: z.enum(["todo", "in-progress", "completed"]),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

export default function CreateTaskDialog({ open, onOpenChange, onSuccess }) {
  const { addTask } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "P3",
      status: "todo",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const taskData = {
        ...data,
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : undefined,
      };

      const response = await taskService.createTask(taskData);

      // Backend returns { success: true, data: { tasks: [...] } }, so get the first task
      const createdTask = response.data.tasks[0];
      addTask(createdTask);
      toast.success("Task created successfully!");
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
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
          <DialogTitle className="text-midnight-blue">
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your task list. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-midnight-blue font-medium">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter task title"
              className="border-teal/30 focus:border-teal"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-burgundy">{errors.title.message}</p>
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
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
