import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import ProjectsPage from "@/pages/ProjectsPage.tsx";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage.tsx";
import HomePage from "@/pages/HomePage";
import "@/assets/styles/global.css";

import { makeServer } from "./server";

makeServer();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />

        <Route path="projects">
          <Route index element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
