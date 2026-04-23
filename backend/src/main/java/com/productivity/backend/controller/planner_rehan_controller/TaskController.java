package com.productivity.backend.controller.planner_rehan_controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.productivity.backend.entity.planner_rehan_entity.Task;
import com.productivity.backend.service.planner_rehan_service.TaskService;
import com.productivity.backend.DTO.planner_rehan_DTO.TaskDTO;
import com.productivity.backend.mapper.planner_rehan_mapper.TaskMapper;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public TaskDTO createTask(@RequestBody TaskDTO taskDTO) {
        Task task = taskService.createTask(taskDTO); // Update service
        return TaskMapper.toDTO(task);
    }

    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskService.getAllTasks().stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TaskDTO getTaskById(@PathVariable Long id) {
        return TaskMapper.toDTO(taskService.getTaskById(id));
    }

    @PutMapping("/{id}")
    public TaskDTO updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        taskDTO.setId(id);
        Task updated = taskService.updateTask(taskDTO); // Update service
        return TaskMapper.toDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/date/{deadline}")
    public List<TaskDTO> getTasksByDeadline(@PathVariable String deadline) {
        return taskService.getTasksByDeadline(deadline)
                .stream().map(TaskMapper::toDTO).collect(Collectors.toList());
    }
}