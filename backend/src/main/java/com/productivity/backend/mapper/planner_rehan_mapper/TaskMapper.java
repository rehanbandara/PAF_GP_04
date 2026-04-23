package com.productivity.backend.mapper.planner_rehan_mapper;

import com.productivity.backend.entity.planner_rehan_entity.Task;
import com.productivity.backend.DTO.planner_rehan_DTO.TaskDTO;

public class TaskMapper {
    public static TaskDTO toDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setPlannedDate(task.getPlannedDate());
        dto.setStartTime(task.getStartTime());
        dto.setEndTime(task.getEndTime());
        dto.setDeadlineDate(task.getDeadlineDate());
        dto.setDeadlineTime(task.getDeadlineTime());
        dto.setDeadline(task.getDeadline());
        dto.setPriority(task.getPriority());
        dto.setEffort(task.getEffort());
        dto.setImportance(task.getImportance());
        dto.setCategory(task.getCategory());
        dto.setNotes(task.getNotes());
        dto.setStatus(task.getStatus());
        return dto;
    }
}