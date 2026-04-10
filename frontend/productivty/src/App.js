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
  );
}

export default App;
