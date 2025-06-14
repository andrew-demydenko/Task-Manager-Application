import apiClient from "./apiClient";
import type { IProject } from "@/types/project";

export const getProjects = async () => {
  try {
    const response = await apiClient.get<null, { projects: IProject[] }>(
      `/projects`
    );
    return response.projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const response = await apiClient.get<null, { projects: IProject }>(
      `/projects/${projectId}`
    );
    return response.projects;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

export const createProject = async (projectData: Omit<IProject, "id">) => {
  try {
    const response = await apiClient.post<null, { projects: IProject }>(
      `/projects`,
      projectData
    );
    return response.projects;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await apiClient.delete(`/projects/${projectId}`);
    return projectId;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
