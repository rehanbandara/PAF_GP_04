import { create } from "zustand";

const STORAGE_KEY = "planner_rehan_tasks_v1";

function safeLoad() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function safeSave(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        // ignore write errors (private mode etc.)
    }
}

/**
 * Task store (demo-ready)
 * ----------------------
 * - Persists tasks to localStorage so refresh doesn't wipe work.
 * - Later you can replace this with React Query + backend persistence.
 */
const useTaskStore = create((set) => ({
    tasks: safeLoad(),

    addTask: (task) =>
        set((state) => {
            const next = [task, ...state.tasks];
            safeSave(next);
            return { tasks: next };
        }),

    deleteTask: (id) =>
        set((state) => {
            const next = state.tasks.filter((task) => task.id !== id);
            safeSave(next);
            return { tasks: next };
        }),

    updateTask: (updatedTask) =>
        set((state) => {
            const next = state.tasks.map((task) =>
                task.id === updatedTask.id ? updatedTask : task
            );
            safeSave(next);
            return { tasks: next };
        }),

    // Helpful for testing/demo resets
    clearAll: () =>
        set(() => {
            safeSave([]);
            return { tasks: [] };
        }),
}));

export default useTaskStore;