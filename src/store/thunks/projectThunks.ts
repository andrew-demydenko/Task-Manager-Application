import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProjects,
  getProject,
  createProject,
  deleteProject,
} from "@/services/projectService";
import {
  setLoading,
  setProjectDetails,
  setProjects,
} from "@/store/slices/projectsSlice";
import type { IProject } from "@/types/project";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const projects = await getProjects();
      dispatch(setProjects(projects));
      return projects;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (projectId: string, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      const project = await getProject(projectId);
      dispatch(setProjectDetails(project));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createNewProject = createAsyncThunk(
  "projects/createNewProject",
  async (projectData: Omit<IProject, "id">, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await createProject(projectData);
      return await dispatch(fetchProjects()).unwrap();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const removeProject = createAsyncThunk(
  "projects/removeProject",
  async (projectId: string, { dispatch }) => {
    await deleteProject(projectId);
    return await dispatch(fetchProjects()).unwrap();
  }
);
