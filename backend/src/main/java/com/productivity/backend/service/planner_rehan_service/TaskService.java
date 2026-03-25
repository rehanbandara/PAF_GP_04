package com.productivity.backend.service.planner_rehan_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.productivity.backend.entity.planner_rehan_entity.Task;
import com.productivity.backend.repository.planner_rehan_repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // CREATE
    public Task createTask(Task task) {
        // Basic defaults for safety
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus("todo");
        }
        if (task.getTitle() != null) {
            task.setTitle(task.getTitle().trim());
        }
        return taskRepository.save(task);
    }

    // READ ALL
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // READ BY ID
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    // UPDATE
    public Task updateTask(Task task) {
        if (task.getTitle() != null) {
            task.setTitle(task.getTitle().trim());
        }
        return taskRepository.save(task);
    }

    // DELETE
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // FILTER: DEADLINE
    public List<Task> getTasksByDeadline(String deadline) {
        return taskRepository.findByDeadline(deadline);
    }

    // FILTER: PLANNED DATE (daily view)
    public List<Task> getTasksByPlannedDate(String plannedDate) {
        return taskRepository.findByPlannedDate(plannedDate);
    }
}