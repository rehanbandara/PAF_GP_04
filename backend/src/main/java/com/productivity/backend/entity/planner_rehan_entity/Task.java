package com.productivity.backend.entity.planner_rehan_entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Task Entity
 * ----------
 * Stores both:
 * - user inputs (plannedDate, deadline, importance, effort, etc.)
 * - computed intelligence fields (matrix + score)
 *
 * Dates are stored as "YYYY-MM-DD" strings for simplicity (frontend-friendly).
 */
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

    // Basics
    private String title;

    /**
     * The day user plans to do the task (daily view uses this).
     * Example: "2026-03-25"
     */
    private String plannedDate;

    /**
     * Real due date (used for overdue + urgency).
     * Example: "2026-03-30"
     */
    private String deadline;

    /**
     * Status: "todo", "in-progress", "done"
     */
    private String status;

    private String category;
    private String notes;

    /**
     * Inputs for analysis:
     * - importance: 1..10 (1 = most important)
     * - effort: hours (can be decimal)
     */
    private Integer importance;
    private Double effort;

    // --- Intelligence fields (saved from frontend analysis) ---
    private Boolean isImportant;
    private Boolean isUrgent;
    private Boolean isFeasibleToday;

    private String matrixQuadrant;     // Q1..Q4
    private String matrixLabel;        // Do now / Schedule / Delegate / Eliminate
    private Integer matrixSortRank;    // 1..4 (Q1 best) or 999

    private Integer priorityScore;     // 0..100

    private String recommendedAction;
    private String reason;
}