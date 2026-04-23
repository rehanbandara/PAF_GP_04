import React, { useEffect, useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import dayjs from "dayjs";

import AddTaskModal from "../../components/planner-rehan/AddTaskModal";
import ContextPanel from "../../components/planner-rehan/ContextPanel";
import TaskBoard from "../../components/planner-rehan/TaskBoard";
import Main_NavBar from "../../components/common/Main_NavBar";

import useTaskStore from "../../store/taskStore";
import { useAuth } from "../../contexts/AuthContext";

/**
 * UI constants
 */
const UI = {
  layout: {
    pageMinHeight: "100vh",
    pagePx: { xs: 2, md: 3 },
    pagePy: { xs: 2, md: 3 },
    containerMaxWidth: 1200,
    gap: 2,
    rightPanelWidth: 360,
    rightPanelHeight: "calc(100vh - 140px)",
  },
};

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [openModal, setOpenModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // 🔐 Auth
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // 📦 Zustand store
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const loading = useTaskStore((s) => s.loading);
  const error = useTaskStore((s) => s.error);
  const clearError = useTaskStore((s) => s.clearError);

  /**
   * Load tasks only when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadTasks();
    }
  }, [isAuthenticated, loadTasks]);

  /**
   * Modal handlers
   */
  const handleOpenAddModal = () => {
    setSelectedTask(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedTask(null);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setOpenModal(true);
  };

  /**
   * Loading state (auth)
   */
  if (authLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: UI.layout.pageMinHeight,
        bgcolor: theme.custom?.colors?.appBg || "background.default",
        px: UI.layout.pagePx,
        py: UI.layout.pagePy,
        color: theme.custom?.colors?.textPrimary || "text.primary",
      })}
    >
      <Box sx={{ maxWidth: UI.layout.containerMaxWidth, mx: "auto" }}>
       

        {/* 🔴 Error display */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{ mt: 2, mb: 2, cursor: "pointer" }}
          >
            {error}
          </Alert>
        )}

        {/* Main layout */}
        <Box
          sx={{
            display: "flex",
            gap: UI.layout.gap,
            alignItems: "flex-start",
            flexWrap: { xs: "wrap", md: "nowrap" },
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          {/* Task Board */}
          <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
            <TaskBoard
              onEdit={handleEditTask}
              selectedDate={selectedDate}
            />
          </Box>

          {/* Right Panel */}
          <Box
            sx={{
              width: UI.layout.rightPanelWidth,
              height: UI.layout.rightPanelHeight,
              flex: `0 0 ${UI.layout.rightPanelWidth}px`,
              overflow: "auto",
            }}
          >
            <ContextPanel
              onOpenModal={handleOpenAddModal}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </Box>
        </Box>

        {/* Add/Edit Task Modal */}
        <AddTaskModal
          open={openModal}
          onClose={handleCloseModal}
          task={selectedTask}
          selectedDate={selectedDate}
        />
      </Box>
    </Box>
  );
}

export default Dashboard;