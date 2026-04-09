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
  );
}

export default App;
