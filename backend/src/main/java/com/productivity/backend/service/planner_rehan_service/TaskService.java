package com.productivity.backend.service.planner_rehan_service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.productivity.backend.entity.planner_rehan_entity.Task;
import com.productivity.backend.entity.user_entity.User;
import com.productivity.backend.repository.planner_rehan_repository.TaskRepository;
import com.productivity.backend.DTO.planner_rehan_DTO.TaskDTO;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }
        if (!(auth.getPrincipal() instanceof User user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid principal");
        }
        return user;
    }

    public Task createTask(TaskDTO taskDTO) {
        User user = getCurrentUser();
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setPlannedDate(taskDTO.getPlannedDate());
        task.setStartTime(taskDTO.getStartTime());
        task.setEndTime(taskDTO.getEndTime());
        task.setDeadlineDate(taskDTO.getDeadlineDate());
        task.setDeadlineTime(taskDTO.getDeadlineTime());
        task.setDeadline(taskDTO.getDeadline());
        task.setPriority(taskDTO.getPriority());
        task.setEffort(taskDTO.getEffort());
        task.setImportance(taskDTO.getImportance());
        task.setCategory(taskDTO.getCategory());
        task.setNotes(taskDTO.getNotes());
        task.setStatus(taskDTO.getStatus());
        task.setUser(user);
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        User user = getCurrentUser();
        return taskRepository.findByUser_Id(user.getId());
    }

    public Task getTaskById(Long id) {
        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (task.getUser() == null || !task.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }

        return task;
    }

    public Task updateTask(TaskDTO taskDTO) {
        User user = getCurrentUser();

        Task existingTask = taskRepository.findById(taskDTO.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (existingTask.getUser() == null || !existingTask.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }

        // update all properties from DTO
        existingTask.setTitle(taskDTO.getTitle());
        existingTask.setPlannedDate(taskDTO.getPlannedDate());
        existingTask.setStartTime(taskDTO.getStartTime());
        existingTask.setEndTime(taskDTO.getEndTime());
        existingTask.setDeadlineDate(taskDTO.getDeadlineDate());
        existingTask.setDeadlineTime(taskDTO.getDeadlineTime());
        existingTask.setDeadline(taskDTO.getDeadline());
        existingTask.setPriority(taskDTO.getPriority());
        existingTask.setEffort(taskDTO.getEffort());
        existingTask.setImportance(taskDTO.getImportance());
        existingTask.setCategory(taskDTO.getCategory());
        existingTask.setNotes(taskDTO.getNotes());
        existingTask.setStatus(taskDTO.getStatus());
        existingTask.setUser(user);

        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id) {
        User user = getCurrentUser();

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (task.getUser() == null || !task.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized");
        }

        taskRepository.deleteById(id);
    }

    public List<Task> getTasksByDeadline(String deadlineDate) {
        User user = getCurrentUser();
        return taskRepository.findByUser_Id(user.getId())
                .stream()
                .filter(task -> deadlineDate.equals(task.getDeadlineDate()))
                .toList();
    }
}