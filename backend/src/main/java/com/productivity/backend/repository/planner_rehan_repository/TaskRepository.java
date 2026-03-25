package com.productivity.backend.repository.planner_rehan_repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.productivity.backend.entity.planner_rehan_entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    // Old: deadline filter (keep if you want)
    List<Task> findByDeadline(String deadline);

    // New: plannedDate filter (daily view)
    List<Task> findByPlannedDate(String plannedDate);
}