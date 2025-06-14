import apiClient from "./apiClient";
import type { ITask } from "@/types/task";

export const getTasks = async (projectId: string) => {
  try {
    const response = await apiClient.get<null, { tasks: ITask[] }>(
      `/tasks/${projectId}`
    );
    return response.tasks.map((task) => ({
      ...task,
      projectId,
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData: Omit<ITask, "id">) => {
  try {
    const response = await apiClient.post<null, { task: ITask }>(
      `/tasks`,
      taskData
    );
    return response.task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (taskId: string, taskData: Partial<ITask>) => {
  try {
    const response = await apiClient.put<null, { task: ITask }>(
      `/tasks/${taskId}`,
      taskData
    );
    return response.task;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    await apiClient.delete(`/tasks/${taskId}`);
    return taskId;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
