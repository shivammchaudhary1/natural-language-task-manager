import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function TaskStatusUpdateDialog({
  open,
  onOpenChange,
  task,
  newStatus,
  onConfirm,
  isLoading,
}) {
  if (!task) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "in-progress":
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "todo":
        return "To Do";
      default:
        return status;
    }
  };

  const getConfirmationMessage = () => {
    switch (newStatus) {
      case "completed":
        return "Are you sure you want to mark this task as completed? This will update your task statistics.";
      case "in-progress":
        return "Are you sure you want to start working on this task?";
      case "todo":
        return "Are you sure you want to move this task back to To Do?";
      default:
        return "Are you sure you want to change the status of this task?";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(newStatus)}
            <div>
              <DialogTitle className="text-midnight-blue">
                Update Task Status
              </DialogTitle>
              <DialogDescription className="mt-1">
                "{task.taskName || task.title}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="text-sm">
              <span className="text-gray-600">Current status:</span>
              <span className="ml-2 font-medium text-midnight-blue">
                {getStatusText(task.status)}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">New status:</span>
              <span className="ml-2 font-medium text-teal">
                {getStatusText(newStatus)}
              </span>
            </div>
          </div>

          <p className="text-sm text-midnight-blue/70 mt-4">
            {getConfirmationMessage()}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-teal/30 text-midnight-blue"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`text-white ${
              newStatus === "completed"
                ? "bg-green-600 hover:bg-green-700"
                : newStatus === "in-progress"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-teal hover:bg-teal/90"
            }`}
          >
            {isLoading ? "Updating..." : `Mark as ${getStatusText(newStatus)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
