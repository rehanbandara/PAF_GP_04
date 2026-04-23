// App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';

// Layouts
import AppLayout from './components/layouts/AppLayout';

// Public pages
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

// Private pages
import Dashboard from './pages/focus-wishwaka/Dashboard';
import Goals from './pages/focus-wishwaka/Goals';
import FocusTimer from './pages/focus-wishwaka/FocusTimer';
import Wellness from './pages/focus-wishwaka/Wellness';
import Settings from './pages/focus-wishwaka/Settings';
import PlannerDashboard from './pages/planner-rehan/Dashboard';

const theme = createTheme({
  palette: {
    primary: { main: '#2c3e50' },
    secondary: { main: '#0f6ead' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes with shared layout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Goals />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/focus-timer"
            element={
              <PrivateRoute>
                <AppLayout>
                  <FocusTimer />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Wellness />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Planner route */}
          <Route
            path="/planner"
            element={
              <PrivateRoute>
                <AppLayout sidebar={false}>
                  <PlannerDashboard />
                </AppLayout>
              </PrivateRoute>
            }
          />

          {/* Redirects & Fallback */}
          <Route path="/" element={<Navigate to="/planner" replace />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
