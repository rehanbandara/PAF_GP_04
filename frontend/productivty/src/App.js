<<<<<<< HEAD
<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
=======
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Dashboard from "./pages/planner-rehan/Dashboard";


function App() {
  return (
    <Routes>
      {/* Redirect root to planner */}
      <Route path="/" element={<Navigate to="/planner" replace />} />

      {/* Pages */}
      <Route path="/planner" element={<Dashboard />} />
      

      {/* fallback */}
      <Route path="*" element={<Navigate to="/planner" replace />} />
    </Routes>
>>>>>>> 7114386843f3923f6d6062fec78eab55fddcd2f6
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/focus-wishwaka/Sidebar';
import Dashboard from './pages/focus-wishwaka/Dashboard';
import Goals from './pages/focus-wishwaka/Goals';
import FocusTimer from './pages/focus-wishwaka/FocusTimer';
import Wellness from './pages/focus-wishwaka/Wellness';
import Settings from './pages/focus-wishwaka/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: `calc(100% - 240px)` },
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/focus-timer" element={<FocusTimer />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
>>>>>>> focus-wellness
  );
}

export default App;
