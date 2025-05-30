import { create } from "zustand";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    limit: 10,
    totalTasks: 0,
    totalPages: 0,
  },
  filters: {
    priority: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  },

  // Actions
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === taskId ? { ...task, ...updates } : task
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task._id !== taskId),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),

  resetFilters: () =>
    set({
      filters: {
        priority: "all",
        search: "",
        sortBy: "createdAt",
        sortOrder: "desc",
      },
      pagination: {
        currentPage: 1,
        limit: 10,
        totalTasks: 0,
        totalPages: 0,
      },
    }),

  // Bulk operations
  addBulkTasks: (newTasks) =>
    set((state) => ({
      tasks: [...newTasks, ...state.tasks],
    })),

  clearTasks: () => set({ tasks: [] }),
}));
