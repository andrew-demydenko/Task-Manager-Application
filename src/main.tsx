import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import ProjectsPage from "@/pages/ProjectsPage.tsx";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />

        <Route path="projects">
          <Route index element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
