import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  User,
  FileText,
  Search,
  Filter,
  Upload,
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
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useTaskStore } from "@/store/taskStore";
import { taskService } from "@/services/taskService";
import TaskList from "@/components/TaskList";
import CreateTaskDialog from "@/components/CreateTaskDialog";
import ParseTextDialog from "@/components/ParseTextDialog";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const {
    tasks = [],
    isLoading = false,
    filters = {
      priority: "all",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    pagination = { currentPage: 1, limit: 10, totalTasks: 0, totalPages: 0 },
    setTasks,
    setLoading,
    setFilters,
    setPagination,
  } = useTaskStore();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showParseDialog, setShowParseDialog] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    priority: { P1: 0, P2: 0, P3: 0, P4: 0 },
    status: { todo: 0, "in-progress": 0, completed: 0 },
  });

  useEffect(() => {
    loadTasks();
    loadStats();
  }, [filters?.priority, filters?.search, pagination?.currentPage]);

  const loadStats = async () => {
    try {
      const response = await taskService.getTaskStats();
      console.log("Stats loaded:", response.data); // Debug log
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination?.currentPage || 1,
        limit: pagination?.limit || 10,
        sortBy: filters?.sortBy || "createdAt",
        sortOrder: filters?.sortOrder || "desc",
      };

      if (filters?.priority && filters.priority !== "all") {
        params.priority = filters.priority;
      }
      if (filters?.search) {
        params.search = filters.search;
      }

      const response = await taskService.getTasks(params);
      setTasks(response.data.tasks);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  console.log("stats:", stats); // Debug log for stats

  const handleLogout = () => {
    clearAuth();
    navigate("/");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page when searching
  };

  const handlePriorityFilter = (priority) => {
    setFilters({ ...filters, priority });
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, currentPage: page });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage via-sage/90 to-sage/80">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-teal/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-teal/10 rounded-lg">
                <FileText className="h-6 w-6 text-teal" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-midnight-blue">
                  Task Dashboard
                </h1>
                <p className="text-sm text-midnight-blue/70">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowParseDialog(true)}
                className="border-teal/30 text-teal hover:bg-teal/10"
              >
                <Upload className="h-4 w-4 mr-2" />
                Parse Text
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-teal hover:bg-teal/90 text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-midnight-blue hover:text-burgundy"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-teal/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-midnight-blue/70">
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-midnight-blue">
                {stats.total}
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-midnight-blue/70">
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-burgundy">
                {stats.priority.P1}
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-midnight-blue/70">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal">
                {stats.status["in-progress"]}
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-midnight-blue/70">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.status.completed}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6 border-teal/20">
          <CardHeader>
            <CardTitle className="text-midnight-blue">
              Task Management
            </CardTitle>
            <CardDescription>
              Manage and organize your tasks efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-midnight-blue/50" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="pl-10 border-teal/30 focus:border-teal"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={filters.priority === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilter("all")}
                  className={
                    filters.priority === "all"
                      ? "bg-teal"
                      : "border-teal/30 text-teal"
                  }
                >
                  All
                </Button>
                <Button
                  variant={filters.priority === "P1" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilter("P1")}
                  className={
                    filters.priority === "P1"
                      ? "bg-burgundy"
                      : "border-burgundy/30 text-burgundy"
                  }
                >
                  P1
                </Button>
                <Button
                  variant={filters.priority === "P2" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilter("P2")}
                  className={
                    filters.priority === "P2"
                      ? "bg-orange-500"
                      : "border-orange-300 text-orange-600"
                  }
                >
                  P2
                </Button>
                <Button
                  variant={filters.priority === "P3" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilter("P3")}
                  className={
                    filters.priority === "P3"
                      ? "bg-yellow-500"
                      : "border-yellow-300 text-yellow-600"
                  }
                >
                  P3
                </Button>
                <Button
                  variant={filters.priority === "P4" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePriorityFilter("P4")}
                  className={
                    filters.priority === "P4"
                      ? "bg-green-500"
                      : "border-green-300 text-green-600"
                  }
                >
                  P4
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={() => {
            loadTasks();
            loadStats();
          }}
        />
      </main>

      {/* Dialogs */}
      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          loadTasks();
          loadStats();
        }}
      />

      <ParseTextDialog
        open={showParseDialog}
        onOpenChange={setShowParseDialog}
        onSuccess={() => {
          loadTasks();
          loadStats();
        }}
      />
    </div>
  );
}
