import {BrowserRouter,Routes,Route} from "react-router-dom";
import React from "react";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import ProjectDetail from "./pages/ProjectDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;