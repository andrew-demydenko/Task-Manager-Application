import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IProject } from "@/types";

interface ProjectsState {
  projects: IProject[];
  projectDetails?: IProject | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  projectDetails: null,
  error: null,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<IProject[]>) => {
      state.projects = action.payload;
    },
    setProjectDetails: (state, action: PayloadAction<IProject | null>) => {
      state.projectDetails = action.payload;
    },
    updateProject: (state, action: PayloadAction<IProject>) => {
      const index = state.projects.findIndex(
        (project) => project.id === action.payload.id
      );
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProjects, updateProject, setLoading, setProjectDetails } =
  projectsSlice.actions;

export default projectsSlice.reducer;
