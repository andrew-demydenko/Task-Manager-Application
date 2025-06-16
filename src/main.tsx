import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import ProjectsPage from "@/pages/ProjectsPage.tsx";
import ProjectDetailsPage from "@/pages/ProjectDetailsPage.tsx";
import HomePage from "@/pages/HomePage";
import { AuthProvider } from "@/providers/AuthProvider";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Layout from "@/components/common/Layout";
import "@/assets/styles/global.css";
import "react-datepicker/dist/react-datepicker.css";

import { makeServer } from "./server";

makeServer();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <Routes>
            <Route index element={<HomePage />} />
            <Route
              path="projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Outlet />
                  </Layout>
                </ProtectedRoute>
              }
            >
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ProtectedRoute>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
