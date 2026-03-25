package com.productivity.backend.controller.planner_rehan_controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.productivity.backend.entity.planner_rehan_entity.Task;
import com.productivity.backend.service.planner_rehan_service.TaskService;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin // allow all origins (development)
public class TaskController {

    @Autowired
    private TaskService taskService;

    // 1) CREATE
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    // 2) READ ALL
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // 2b) READ BY PLANNED DATE (recommended daily view)
    // GET /api/tasks/planned/2026-03-25
    @GetMapping("/planned/{plannedDate}")
    public List<Task> getTasksByPlannedDate(@PathVariable String plannedDate) {
        return taskService.getTasksByPlannedDate(plannedDate);
    }

    // 2c) READ BY DEADLINE (optional)
    // GET /api/tasks/deadline/2026-03-25
    @GetMapping("/deadline/{deadline}")
    public List<Task> getTasksByDeadline(@PathVariable String deadline) {
        return taskService.getTasksByDeadline(deadline);
    }

    // 3) READ BY ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id);
    }

    // 4) UPDATE
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return taskService.updateTask(task);
    }

    // 5) DELETE
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task deleted successfully";
    }
}