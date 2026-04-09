import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

import dayjs from "dayjs";

const UI = {
  layout: {
    radius: 2,
    padding: 1.5,
    accentBarWidth: 5,

    titlePadLeft: 1.0,
    contentPadLeft: 0.5,

    chipsGap: 0.75,
    rowGap: 0.75,

    buttonRadius: 2,
  },
  typography: {
    titleWeight: 900,
    metaWeight: 800,
    bodySize: 13,
    captionSize: 12,
  },
};

function getStatusAction(status) {
  switch (status) {
    case "todo":
      return { label: "Start", nextStatus: "in-progress" };
    case "in-progress":
      return { label: "Mark done", nextStatus: "done" };
    case "done":
      return { label: "Move back", nextStatus: "todo" };
    default:
      return null;
  }
}

function getStatusChip(status) {
  switch (status) {
    case "todo":
      return { label: "To do" };
    case "in-progress":
      return { label: "In progress" };
    case "done":
      return { label: "Done" };
    default:
      return { label: "Unknown" };
  }
}

function getPriorityMeta(priority) {
  switch (priority) {
    case "high":
      return { label: "High", key: "red" };
    case "medium":
      return { label: "Medium", key: "yellow" };
    case "low":
      return { label: "Low", key: "green" };
    default:
      return { label: "Normal", key: "blue" };
  }
}

function formatDelta(target, now = dayjs()) {
  if (!target || !target.isValid()) return "";

  const diffMs = target.diff(now);
  const absMs = Math.abs(diffMs);

  const totalMinutes = Math.floor(absMs / (60 * 1000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
  const mins = totalMinutes - days * 60 * 24 - hours * 60;

  const parts = [];
  if (days) parts.push(`${days} day${days === 1 ? "" : "s"}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  if (!days && !hours) parts.push(`${mins} min${mins === 1 ? "" : "s"}`);
  else if (mins) parts.push(`${mins} min${mins === 1 ? "" : "s"}`);

  if (diffMs >= 0) return `in ${parts.join(" ")}`;
  return `passed (${parts.join(" ")} ago)`;
}

function TaskCard({
  task,
  id,
  title,
  priority,
  category,
  status,

  plannedDate,
  startTime,
  endTime,
  deadlineDate,
  deadlineTime,

  // legacy fallback
  deadline,

  onDelete = () => {},
  onStatusChange = () => {},
  onEdit = () => {},
}) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  // update countdown text every minute
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const todayLocal = useMemo(() => dayjs().format("YYYY-MM-DD"), []);
  const effectiveDeadlineDate = deadlineDate || deadline || "";
  const isScheduledTask = Boolean(plannedDate && startTime && endTime);

  const plannedStartDateTime = useMemo(() => {
    if (!plannedDate || !startTime) return null;
    const dt = dayjs(`${plannedDate}T${startTime}`);
    return dt.isValid() ? dt : null;
  }, [plannedDate, startTime]);

  const deadlineDateTime = useMemo(() => {
    if (!effectiveDeadlineDate) return null;
    const time = deadlineTime || "23:59";
    const dt = dayjs(`${effectiveDeadlineDate}T${time}`);
    return dt.isValid() ? dt : null;
  }, [effectiveDeadlineDate, deadlineTime]);

  const isOverdue =
    Boolean(effectiveDeadlineDate) && effectiveDeadlineDate < todayLocal && status !== "done";
  const isDueToday =
    Boolean(effectiveDeadlineDate) && effectiveDeadlineDate === todayLocal && status !== "done";

  const statusAction = getStatusAction(status);
  const statusChip = getStatusChip(status);
  const priorityMeta = getPriorityMeta(priority);

  const timeUntilStartText = useMemo(() => {
    if (!isScheduledTask || !plannedStartDateTime) return "";
    return formatDelta(plannedStartDateTime, dayjs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScheduledTask, plannedStartDateTime, tick]);

  const timeUntilDeadlineText = useMemo(() => {
    if (!deadlineDateTime) return "";
    return formatDelta(deadlineDateTime, dayjs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadlineDateTime, tick]);

  const openMenu = (e) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const closeMenu = (e) => {
    e?.stopPropagation?.();
    setMenuAnchor(null);
  };

  return (
    <Paper
      elevation={0}
      onClick={() => onEdit(task)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onEdit(task);
      }}
      sx={(theme) => {
        const label = theme.custom.colors.label || {};

        const statusAccent =
          status === "done"
            ? theme.custom.colors.success
            : status === "in-progress"
            ? theme.custom.colors.info
            : theme.custom.colors.borderAccent;

        const borderColor = isOverdue
          ? theme.custom.colors.danger
          : isDueToday
          ? theme.custom.colors.warning
          : theme.custom.colors.borderDefault;

        const chipBg =
          theme.palette.mode === "dark" ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.03)";

        const priorityBorder =
          priorityMeta.key === "red"
            ? label.red || theme.custom.colors.danger
            : priorityMeta.key === "yellow"
            ? label.yellow || theme.custom.colors.warning
            : priorityMeta.key === "green"
            ? label.green || theme.custom.colors.success
            : label.blue || theme.custom.colors.info;

        return {
          position: "relative",
          overflow: "hidden",
          p: UI.layout.padding,
          borderRadius: UI.layout.radius,
          cursor: "pointer",
          border: "1px solid",
          borderColor,
          bgcolor: theme.custom.colors.surface1,
          color: theme.custom.colors.textPrimary,
          transition: "transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: 2,
            borderColor: theme.custom.colors.borderAccent,
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: theme.custom.colors.borderAccent,
            outlineOffset: 2,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: UI.layout.accentBarWidth,
            bgcolor: statusAccent,
          },

          "--taskcard-chip-bg": chipBg,
          "--taskcard-priority-border": priorityBorder,
        };
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: UI.typography.titleWeight,
            lineHeight: 1.2,
            wordBreak: "break-word",
            pr: 1,
            pl: UI.layout.titlePadLeft,
          }}
        >
          {title}
        </Typography>

        <IconButton
          aria-label="task menu"
          size="small"
          onClick={openMenu}
          sx={(theme) => ({
            color: theme.custom.colors.textSecondary,
            mt: -0.25,
            "&:hover": {
              bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            },
          })}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          onClick={(e) => e.stopPropagation()}
          PaperProps={{
            sx: (theme) => ({
              borderRadius: 2,
              border: "1px solid",
              borderColor: theme.custom.colors.borderDefault,
              bgcolor: theme.custom.colors.surface1,
              color: theme.custom.colors.textPrimary,
              minWidth: 160,
            }),
          }}
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu(e);
              onEdit(task);
            }}
          >
            <EditOutlinedIcon fontSize="small" style={{ marginRight: 10 }} />
            Edit
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu(e);
              onDelete(id);
            }}
            sx={(theme) => ({ color: theme.custom.colors.danger })}
          >
            <DeleteOutlineIcon fontSize="small" style={{ marginRight: 10 }} />
            Delete
          </MenuItem>
        </Menu>
      </Stack>

      {/* Chips row */}
      <Stack
        direction="row"
        spacing={UI.layout.chipsGap}
        sx={{
          mt: 1,
          flexWrap: "wrap",
          rowGap: UI.layout.rowGap,
          pl: UI.layout.contentPadLeft,
        }}
      >
        <Chip
          size="small"
          label={statusChip.label}
          variant="outlined"
          sx={(theme) => ({
            fontWeight: UI.typography.metaWeight,
            borderColor:
              status === "done"
                ? theme.custom.colors.success
                : status === "in-progress"
                ? theme.custom.colors.info
                : theme.custom.colors.borderDefault,
            bgcolor: "var(--taskcard-chip-bg)",
          })}
        />

        <Chip
          size="small"
          label={`Priority: ${priorityMeta.label}`}
          variant="outlined"
          sx={{
            fontWeight: UI.typography.metaWeight,
            borderColor: "var(--taskcard-priority-border)",
            bgcolor: "var(--taskcard-chip-bg)",
          }}
        />

        {category ? (
          <Chip
            size="small"
            label={category}
            variant="outlined"
            sx={(theme) => ({
              fontWeight: UI.typography.metaWeight,
              borderColor: theme.custom.colors.borderDefault,
              bgcolor: "var(--taskcard-chip-bg)",
            })}
          />
        ) : null}

        {isScheduledTask ? (
          <Chip
            size="small"
            label="Scheduled"
            sx={(theme) => ({
              fontWeight: 900,
              bgcolor: theme.custom.colors.info,
              color: "#fff",
            })}
          />
        ) : null}

        {isOverdue ? (
          <Chip
            size="small"
            label="Overdue"
            sx={(theme) => ({
              fontWeight: 900,
              bgcolor: theme.custom.colors.danger,
              color: "#fff",
            })}
          />
        ) : isDueToday ? (
          <Chip
            size="small"
            label="Due today"
            sx={(theme) => ({
              fontWeight: 900,
              bgcolor: theme.custom.colors.warning,
              color: theme.palette.mode === "dark" ? "#080705" : "#111827",
            })}
          />
        ) : null}
      </Stack>

      {/* Planned schedule line */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 1.15, pl: UI.layout.contentPadLeft }}
      >
        <EventAvailableOutlinedIcon fontSize="small" />
        <Typography
          sx={(theme) => ({
            color: theme.custom.colors.textSecondary,
            fontSize: UI.typography.bodySize,
          })}
        >
          Planned: <strong>{plannedDate || "—"}</strong>
          {startTime && endTime ? (
            <>
              {" "}
              · <strong>{startTime}</strong> - <strong>{endTime}</strong>
            </>
          ) : null}
        </Typography>
      </Stack>

      {/* Countdown to start */}
      {isScheduledTask && timeUntilStartText ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 0.65, pl: UI.layout.contentPadLeft }}
        >
          <AccessTimeOutlinedIcon fontSize="small" />
          <Typography
            sx={(theme) => ({
              color: theme.custom.colors.textSecondary,
              fontSize: UI.typography.bodySize,
            })}
          >
            Starts {timeUntilStartText}
          </Typography>
        </Stack>
      ) : null}

      {/* Deadline line */}
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 0.8, pl: UI.layout.contentPadLeft }}
      >
        <CalendarMonthOutlinedIcon fontSize="small" />
        <Typography
          sx={(theme) => ({
            color: theme.custom.colors.textSecondary,
            fontSize: UI.typography.bodySize,
          })}
        >
          Deadline: <strong>{effectiveDeadlineDate || "—"}</strong>
          {deadlineTime ? (
            <>
              {" "}
              · <strong>{deadlineTime}</strong>
            </>
          ) : null}
        </Typography>
      </Stack>

      {/* Countdown to deadline */}
      {deadlineDateTime && timeUntilDeadlineText ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mt: 0.65, pl: UI.layout.contentPadLeft }}
        >
          <EventBusyOutlinedIcon fontSize="small" />
          <Typography
            sx={(theme) => ({
              color: theme.custom.colors.textSecondary,
              fontSize: UI.typography.bodySize,
            })}
          >
            Deadline {timeUntilDeadlineText}
          </Typography>
        </Stack>
      ) : null}

      {/* Primary action */}
      {statusAction ? (
        <Box sx={{ mt: 1.25, pl: UI.layout.contentPadLeft }}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(id, statusAction.nextStatus);
            }}
            sx={(theme) => ({
              borderRadius: UI.layout.buttonRadius,
              fontWeight: 900,
              bgcolor: theme.custom.colors.primaryBtnBg,
              color: theme.custom.colors.primaryBtnText,
              "&:hover": { bgcolor: theme.custom.colors.primaryBtnHoverBg },
              textTransform: "none",
            })}
          >
            {statusAction.label}
          </Button>
        </Box>
      ) : null}
    </Paper>
  );
}

export default TaskCard;