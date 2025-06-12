import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, getProject } from "@/services/projectService";
import {
  setLoading,
  setProjectDetails,
  setProjects,
} from "@/store/slices/projectsSlice";

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
