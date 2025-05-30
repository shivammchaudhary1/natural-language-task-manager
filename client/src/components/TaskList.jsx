import React, { useState } from "react";
import { format } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { taskService } from "@/services/taskService";
import { useTaskStore } from "@/store/taskStore";
import UpdateTaskDialog from "./UpdateTaskDialog";
import TaskStatusUpdateDialog from "./TaskStatusUpdateDialog";

const priorityColors = {
  P1: "bg-red-100 text-red-800 border-red-200",
  P2: "bg-orange-100 text-orange-800 border-orange-200",
  P3: "bg-yellow-100 text-yellow-800 border-yellow-200",
  P4: "bg-green-100 text-green-800 border-green-200",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800 border-gray-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
};

export default function TaskList({
  tasks,
  isLoading,
  onRefresh,
  pagination,
  onPageChange,
}) {
  const { removeTask, updateTask } = useTaskStore();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null });
  const [updateDialog, setUpdateDialog] = useState({ open: false, task: null });
  const [statusDialog, setStatusDialog] = useState({
    open: false,
    task: null,
    newStatus: null,
  });
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteDialog.task) return;

    try {
      await taskService.deleteTask(deleteDialog.task._id);
      removeTask(deleteDialog.task._id);
      toast.success("Task deleted successfully");
      setDeleteDialog({ open: false, task: null });
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusDialog.task || !statusDialog.newStatus) return;

    setStatusUpdateLoading(true);
    try {
      const response = await taskService.updateTask(statusDialog.task._id, {
        status: statusDialog.newStatus,
      });

      updateTask(statusDialog.task._id, response.data.task);
      toast.success(
        `Task marked as ${
          statusDialog.newStatus === "in-progress"
            ? "In Progress"
            : statusDialog.newStatus === "completed"
            ? "Completed"
            : "To Do"
        }`
      );
      setStatusDialog({ open: false, task: null, newStatus: null });

      // Ensure stats are refreshed after successful update
      setTimeout(() => {
        onRefresh();
      }, 100);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleQuickStatusChange = (task, newStatus) => {
    setStatusDialog({ open: true, task, newStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-teal/10 rounded-full">
              <AlertCircle className="h-8 w-8 text-teal" />
            </div>
            <h3 className="text-lg font-semibold text-midnight-blue">
              No tasks found
            </h3>
            <p className="text-midnight-blue/70">
              Create your first task or parse some text to get started!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card
            key={task._id}
            className={`border-l-4 hover:shadow-md transition-shadow ${
              task.status === "completed"
                ? "border-l-green-500 bg-green-50/30"
                : task.status === "in-progress"
                ? "border-l-blue-500 bg-blue-50/30"
                : "border-l-teal bg-white"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-midnight-blue mb-2">
                    {task.taskName || task.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        priorityColors[task.priority] || priorityColors.P4
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        statusColors[task.status] || statusColors.todo
                      }`}
                    >
                      {task.status === "in-progress"
                        ? "In Progress"
                        : task.status === "todo"
                        ? "To Do"
                        : "Completed"}
                    </span>
                    {task.confidence && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal border border-teal/20">
                        {Math.round(task.confidence * 100)}% confidence
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Quick status update buttons */}
                  {task.status !== "completed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickStatusChange(task, "completed")}
                      className="text-green-600 hover:bg-green-50"
                      title="Mark as completed"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}

                  {task.status === "todo" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleQuickStatusChange(task, "in-progress")
                      }
                      className="text-blue-600 hover:bg-blue-50"
                      title="Start working"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}

                  {task.status === "completed" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuickStatusChange(task, "todo")}
                      className="text-gray-600 hover:bg-gray-50"
                      title="Move back to To Do"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdateDialog({ open: true, task })}
                    className="text-teal hover:bg-teal/10"
                    title="Edit task"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, task })}
                    className="text-burgundy hover:bg-burgundy/10"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {task.description && (
                <p className="text-midnight-blue/80 mb-3">{task.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm text-midnight-blue/60">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}

                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>Assigned to: {task.assignee}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <span>
                    Created: {format(new Date(task.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white rounded-lg border border-teal/20">
          <div className="flex items-center gap-2 text-sm text-midnight-blue/70">
            <span>
              Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.currentPage * pagination.limit,
                pagination.totalTasks
              )}{" "}
              of {pagination.totalTasks} tasks
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="border-teal/30 text-midnight-blue hover:bg-teal/10"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1 mx-2">
              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  let pageNumber;
                  if (pagination.totalPages <= 5) {
                    pageNumber = i + 1;
                  } else {
                    const start = Math.max(1, pagination.currentPage - 2);
                    const end = Math.min(pagination.totalPages, start + 4);
                    pageNumber = start + i;
                    if (pageNumber > end) return null;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        pageNumber === pagination.currentPage
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => onPageChange(pageNumber)}
                      className={
                        pageNumber === pagination.currentPage
                          ? "bg-teal text-white"
                          : "border-teal/30 text-midnight-blue hover:bg-teal/10"
                      }
                    >
                      {pageNumber}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              className="border-teal/30 text-midnight-blue hover:bg-teal/10"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, task: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "
              {deleteDialog.task?.taskName || deleteDialog.task?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, task: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Task Dialog */}
      <UpdateTaskDialog
        open={updateDialog.open}
        onOpenChange={(open) => setUpdateDialog({ open, task: null })}
        task={updateDialog.task}
        onSuccess={onRefresh}
      />

      {/* Status Update Dialog */}
      <TaskStatusUpdateDialog
        open={statusDialog.open}
        onOpenChange={(open) =>
          setStatusDialog({ open: false, task: null, newStatus: null })
        }
        task={statusDialog.task}
        newStatus={statusDialog.newStatus}
        onConfirm={handleStatusUpdate}
        isLoading={statusUpdateLoading}
      />
    </>
  );
}
