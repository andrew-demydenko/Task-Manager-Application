import apiClient from "./apiClient";

export const getProjects = async () => {
  try {
    const response = await apiClient.get(`/projects`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getProject = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};
