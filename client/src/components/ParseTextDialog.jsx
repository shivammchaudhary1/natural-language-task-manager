import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, FileText } from "lucide-react";
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

const parseSchema = z.object({
  text: z.string().min(10, "Text must be at least 10 characters long"),
});

export default function ParseTextDialog({ open, onOpenChange, onSuccess }) {
  const { addBulkTasks } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(parseSchema),
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
      toast.error("Please upload a .txt or .md file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Read file content and set it in the textarea
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setValue("text", content);
    };
    reader.readAsText(file);
  };

  const parseText = async (data) => {
    setIsLoading(true);
    try {
      let response;

      if (selectedFile) {
        // Parse uploaded file
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await taskService.parseFile(formData);
      } else {
        // Parse text input
        response = await taskService.parseText({ text: data.text });
      }

      console.log("Parse response:", response);

      // Check the correct path for tasks based on the actual response structure
      const tasks =
        response.data.tasks || (response.data.data && response.data.data.tasks);

      if (tasks && tasks.length > 0) {
        console.log("Found tasks to add:", tasks.length);
        addBulkTasks(tasks);

        toast.success(`Successfully parsed and created ${tasks.length} tasks!`);
        handleClose();
        onSuccess();
      } else {
        console.error("No tasks found in response:", response);
        toast.error("No tasks could be extracted from the text");
      }
    } catch (error) {
      console.error("Parse error:", error);
      toast.error(error.response?.data?.message || "Failed to parse text");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onOpenChange(false);
  };

  const priorityColors = {
    P1: "bg-red-100 text-red-800 border-red-200",
    P2: "bg-orange-100 text-orange-800 border-orange-200",
    P3: "bg-yellow-100 text-yellow-800 border-yellow-200",
    P4: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-midnight-blue">
            Parse Natural Language Text
          </DialogTitle>
          <DialogDescription>
            Upload a file or paste text to automatically extract and create
            tasks using AI.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(parseText)} className="space-y-4">
          {/* File Upload Section */}
          <div className="space-y-2">
            <Label className="text-midnight-blue font-medium">
              Upload File (.txt or .md)
            </Label>
            <div className="border-2 border-dashed border-teal/30 rounded-lg p-6 text-center hover:border-teal/50 transition-colors">
              <Upload className="h-8 w-8 text-teal mx-auto mb-2" />
              <p className="text-sm text-midnight-blue/70 mb-2">
                Drop a file here or click to upload
              </p>
              <Input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="border-0 p-0 h-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal file:text-white hover:file:bg-teal/90"
              />
              {selectedFile && (
                <div className="mt-2 flex items-center justify-center gap-2 text-sm text-teal">
                  <FileText className="h-4 w-4" />
                  <span>{selectedFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-midnight-blue/50 font-medium">
            OR
          </div>

          {/* Text Input Section */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-midnight-blue font-medium">
              Paste Text Content
            </Label>
            <Textarea
              id="text"
              placeholder="Paste your meeting notes, task descriptions, or any text containing tasks..."
              className="border-teal/30 focus:border-teal min-h-[150px]"
              {...register("text")}
            />
            {errors.text && (
              <p className="text-sm text-burgundy">{errors.text.message}</p>
            )}
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
              {isLoading
                ? "Parsing & Creating Tasks..."
                : "Parse & Create Tasks"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
