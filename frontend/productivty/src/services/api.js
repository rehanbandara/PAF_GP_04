import axios from "axios";

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  getProfile: () => api.get("/auth/me"),
};

// Tasks endpoints
export const taskAPI = {
  getAll: () => api.get("/tasks"),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (taskData) => api.post("/tasks", taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
  getByDeadline: (deadline) => api.get(`/tasks/date/${deadline}`),
};

// Goals endpoints
export const goalsAPI = {
  getAll: () => api.get("/goals"),
  getById: (id) => api.get(`/goals/${id}`),
  create: (goalData) => api.post("/goals", goalData),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
  updateProgress: (id, progress) =>
    api.patch(`/goals/${id}/progress`, progress, {
      headers: { "Content-Type": "application/json" },
    }),
  getStats: () => api.get("/goals/stats"),
};

// Timer endpoints
export const timerAPI = {
  getCurrentSession: () => api.get("/timer/current"),
  startSession: (sessionData) => api.post("/timer/start", sessionData),
  pauseSession: (sessionId) => api.patch(`/timer/${sessionId}/pause`),
  resumeSession: (sessionId) => api.patch(`/timer/${sessionId}/resume`),
  completeSession: (sessionId) => api.patch(`/timer/${sessionId}/complete`),
  resetSession: (sessionId) => api.patch(`/timer/${sessionId}/reset`),
  getSessionHistory: (params) => api.get("/timer/history", { params }),
  getTodayStats: () => api.get("/timer/stats/today"),
  getWeeklyStats: () => api.get("/timer/stats/weekly"),
  getMonthlyStats: () => api.get("/timer/stats/monthly"),
  getRecentCompletedSessions: () => api.get("/timer/sessions/recent-completed"),
  getCompletedSessionsCount: () => api.get("/timer/sessions/completed-count"),
};

// Wellness endpoints
export const wellnessAPI = {
  getReminders: () => api.get("/wellness/reminders"),
  updateReminders: (reminders) => api.put("/wellness/reminders", reminders),
  getWellnessStats: () => api.get("/wellness/stats"),
  logBreak: (breakData) => api.post("/wellness/breaks", breakData),
  getBreakHistory: (params) => api.get("/wellness/breaks", { params }),
  updateEyeRestSettings: (settings) => api.put("/wellness/eye-rest", settings),
  updatePostureSettings: (settings) => api.put("/wellness/posture", settings),
  getWellnessTips: () => api.get("/wellness/tips"),
};

// Settings endpoints
export const settingsAPI = {
  getUserSettings: () => api.get("/settings"),
  updateSettings: (settings) => api.put("/settings", settings),
  resetToDefaults: () => api.post("/settings/reset"),
  exportData: () => api.get("/settings/export"),
  importData: (data) => api.post("/settings/import", data),
  getNotificationSettings: () => api.get("/settings/notifications"),
  updateNotificationSettings: (settings) => api.put("/settings/notifications", settings),
  getFocusSettings: () => api.get("/settings/focus"),
  updateFocusSettings: (settings) => api.put("/settings/focus", settings),
  getWellnessSettings: () => api.get("/settings/wellness"),
  updateWellnessSettings: (settings) => api.put("/settings/wellness", settings),
};

// Dashboard endpoints
export const dashboardAPI = {
  getOverview: () => api.get("/dashboard/overview"),
  getProductivityStats: (period) => api.get(`/dashboard/productivity/${period}`),
  getRecentActivity: () => api.get("/dashboard/activity"),
  getUpcomingGoals: () => api.get("/dashboard/goals/upcoming"),
  getWellnessStatus: () => api.get("/dashboard/wellness"),
  getFocusTimeToday: () => api.get("/dashboard/focus/today"),
  getWeeklyProgress: () => api.get("/dashboard/progress/weekly"),
  getMonthlyProgress: () => api.get("/dashboard/progress/monthly"),
};

// Notifications endpoints
export const notificationsAPI = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get("/notifications/unread-count"),
  subscribeToPush: (subscriptionData) => api.post("/notifications/subscribe", subscriptionData),
  unsubscribeFromPush: () => api.post("/notifications/unsubscribe"),
};

// Analytics endpoints
export const analyticsAPI = {
  getProductivityReport: (params) => api.get("/analytics/productivity", { params }),
  getWellnessReport: (params) => api.get("/analytics/wellness", { params }),
  getFocusTimeReport: (params) => api.get("/analytics/focus-time", { params }),
  getGoalsReport: (params) => api.get("/analytics/goals", { params }),
  getTrends: (period) => api.get(`/analytics/trends/${period}`),
  exportReport: (reportType, params) => api.get(`/analytics/export/${reportType}`, { params }),
};

// Utility functions
export const apiUtils = {
  handleError: (error) => {
    const message = error.response?.data?.message || error.message || "An error occurred";
    console.error("API Error:", error);

    if (error.code === "ERR_NETWORK" || (error.message || "").includes("Network Error")) {
      error.code = "NETWORK_ERROR";
    }

    return message;
  },

  createFormData: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  },

  createCancelToken: () => axios.CancelToken.source(),
  isCancel: axios.isCancel,
};

export default api;