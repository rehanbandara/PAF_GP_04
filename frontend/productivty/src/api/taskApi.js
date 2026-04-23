import api from "../services/api";

/**
 * taskApi.js
 * ----------
 * Centralized HTTP calls to Spring Boot backend for Tasks.
 *
 * IMPORTANT:
 * - Use the shared axios instance from services/api.js so the JWT token
 *   is attached automatically via request interceptor.
 */

export async function fetchTasks() {
  const res = await api.get("/tasks");
  return res.data; // expected: array of tasks
}

export async function createTask(task) {
  const res = await api.post("/tasks", task);
  return res.data; // expected: saved task (with id)
}

/**
 * updateTask
 * - Accepts a full task object that includes id.
 * - Sends PUT /api/tasks/{id}
 */
export async function updateTask(task) {
  if (!task?.id) throw new Error("updateTask requires task.id");
  const res = await api.put(`/tasks/${task.id}`, task);
  return res.data;
}

export async function deleteTask(id) {
  const res = await api.delete(`/tasks/${id}`);
  return res.data; // could be message string or empty
}