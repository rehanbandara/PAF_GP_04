package com.productivity.backend.DTO.planner_rehan_DTO;

import lombok.Data;

@Data
public class TaskDTO {
    private Long id;
    private String title;
    private String plannedDate;
    private String startTime;
    private String endTime;
    private String deadlineDate;
    private String deadlineTime;
    private String deadline;
    private String priority;
    private Integer effort;
    private Integer importance;
    private String category;
    private String notes;
    private String status;
}