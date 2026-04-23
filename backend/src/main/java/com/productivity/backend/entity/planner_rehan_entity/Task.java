package com.productivity.backend.entity.planner_rehan_entity;

import com.productivity.backend.entity.user_entity.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔐 USER RELATION (NEW)
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore // Prevent infinite recursion for JSON serialization
    private User user;

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