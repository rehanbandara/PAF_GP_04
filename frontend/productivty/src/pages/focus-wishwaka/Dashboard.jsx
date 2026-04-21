import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Refresh as ResetIcon,
  Work as WorkIcon,
  FreeBreakfast as BreakIcon,
  SelfImprovement as PostureIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { goalsService } from '../../services/goalsService';
import { settingsAPI } from '../../services/api';

const Dashboard = () => {
  // Focus Timer State
  const [timerState, setTimerState] = useState({
    mode: 'work', // 'work' | 'break'
    isRunning: false,
    timeLeft: 25 * 60, // seconds
    currentSession: 1
  });

  // Timer Settings State
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getFocusSettings();
        console.log('DEBUG: Dashboard - Settings API response:', response.data);
        
        // Handle different possible response structures
        let workDurationValue = 25;
        let breakDurationValue = 5;
        
        if (response.data) {
          const settings = response.data;
          
          // Check if settings has focus property
          if (settings.focus) {
            workDurationValue = settings.focus.workDuration || 25;
            breakDurationValue = settings.focus.shortBreakDuration || 5;
          } 
          // Check if settings is the focus object directly
          else if (settings.workDuration !== undefined) {
            workDurationValue = settings.workDuration;
            breakDurationValue = settings.shortBreakDuration || 5;
          }
        }
        
        console.log('DEBUG: Dashboard - Setting workDuration:', workDurationValue, 'breakDuration:', breakDurationValue);
        setWorkDuration(workDurationValue);
        setBreakDuration(breakDurationValue);
      } catch (error) {
        console.error('Error fetching settings:', error);
        // Fallback to default values if backend is unavailable
        setWorkDuration(25);
        setBreakDuration(5);
      }
    };

    fetchSettings();
  }, []);

  // Helper functions for Today's Progress section
  const completedSessionsCount = () => {
    return productivity.completedSessions;
  };

  const calculateTotalFocusTime = () => {
    return productivity.totalFocusTime;
  };

  // Productivity Summary State
  const [productivity, setProductivity] = useState({
    completedSessions: 0,
    totalFocusTime: 0, // minutes
    tasksCompleted: 0
  });

  // Wellness Status State
  const [wellness] = useState({
    lastBreak: '10:30 AM',
    eyeRestStatus: 'Good',
    postureReminder: 'Active'
  });

  // Goals Management State
  const [goals, setGoals] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    notStarted: 0
  });

  // Fetch goals data
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const goalsData = await goalsService.getGoals();
        const total = goalsData.length;
        const completed = goalsData.filter(goal => goal.completed).length;
        const inProgress = goalsData.filter(goal => goal.status === 'IN_PROGRESS' || goal.status === 'in-progress').length;
        const notStarted = goalsData.filter(goal => goal.status === 'NOT_STARTED' || goal.status === 'not-started').length;
        
        setGoals({
          total,
          completed,
          inProgress,
          notStarted
        });

        // Update productivity state with actual completed sessions
        setProductivity(prev => ({
          ...prev,
          completedSessions: completed,
          totalFocusTime: completed * 25, // Assuming 25 minutes per completed session
          tasksCompleted: completed
        }));
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    fetchGoals();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerState.isRunning && timerState.timeLeft > 0) {
      interval = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timerState.timeLeft === 0) {
      // Session completed
      setTimerState(prev => ({
        ...prev,
        isRunning: false,
        mode: prev.mode === 'work' ? 'break' : 'work',
        timeLeft: prev.mode === 'work' ? 5 * 60 : 25 * 60
      }));
      
      if (timerState.mode === 'work') {
        setProductivity(prev => ({
          ...prev,
          completedSessions: prev.completedSessions + 1,
          totalFocusTime: prev.totalFocusTime + 25
        }));
      } else if (goals.completed > 0) {
        // Update completed sessions when goals are completed
        setProductivity(prev => ({
          ...prev,
          completedSessions: prev.completedSessions + 1,
          totalFocusTime: prev.totalFocusTime + 25
        }));
      }
    }

    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.timeLeft, timerState.mode, timerState.currentSession]);

  const formatFocusTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleStartPause = () => {
    setTimerState(prev => ({
      ...prev,
      isRunning: !prev.isRunning,
      mode: !prev.isRunning ? 'work' : prev.mode
    }));
  };

  const handleReset = () => {
    setTimerState({
      mode: 'work',
      isRunning: false,
      timeLeft: 25 * 60,
      currentSession: timerState.currentSession + 1
    });
  };

  const handleTakeBreak = () => {
    setTimerState({
      mode: 'break',
      isRunning: true,
      timeLeft: 5 * 60,
      currentSession: timerState.currentSession + 1
    });
  };

  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Focus & Wellness Dashboard
        </Typography>

        <Grid container spacing={3}>
          {/* Goal Management Section */}
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Goal Management
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Total Goals</Typography>
                      <Typography variant="h6" color="primary.main">{goals.total}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Completed</Typography>
                      <Typography variant="h6" color="success.main">{goals.completed}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">In Progress</Typography>
                      <Typography variant="h6" color="warning.main">{goals.inProgress}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">Not Started</Typography>
                      <Typography variant="h6" color="info.main">{goals.notStarted}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Overall Progress</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={(goals.completed / goals.total) * 100} 
                      sx={{ flex: 1, mr: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((goals.completed / goals.total) * 100)}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Progress Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <WorkIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Today's Progress
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h4" color="primary">
                    {productivity.completedSessions}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total completed sessions
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Current Settings Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Current Settings
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Work Duration</Typography>
                  <Typography variant="h6" color="primary.main">{workDuration} minutes</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Break Duration</Typography>
                  <Typography variant="h6" color="info.main">{breakDuration} minutes</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
