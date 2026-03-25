import axios from "axios";

/**
 * taskApi.js
 * ----------
 * Centralized HTTP calls to Spring Boot backend.
 *
 * NOTE:
 * - If you get CORS issues, confirm TaskController has @CrossOrigin
 *   (or implement global CORS config).
 */

const API_URL = "http://localhost:8080/api/tasks";

export async function fetchTasks({ plannedDate } = {}) {
    // Optional: filter by plannedDate (preferred daily view)
    if (plannedDate) {
        const res = await axios.get(`${API_URL}/planned/${plannedDate}`);
        return res.data;
    }

    const res = await axios.get(API_URL);
    return res.data;
}

export async function createTask(task) {
    const res = await axios.post(API_URL, task);
    return res.data; // saved task (with id)
}

export async function updateTask(task) {
    if (!task?.id) throw new Error("updateTask requires task.id");
    const res = await axios.put(`${API_URL}/${task.id}`, task);
    return res.data;
}

export async function deleteTask(id) {
    await axios.delete(`${API_URL}/${id}`);
    return true;
}