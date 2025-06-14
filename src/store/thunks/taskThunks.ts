import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasks,
  createTask,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from "@/services/taskService";
import { setLoading, setTasks, updateTask } from "@/store/slices/tasksSlice";
import type { ITask } from "@/types/task";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (projectId: string | undefined, { dispatch }) => {
    try {
      if (!projectId) {
        throw new Error("Project ID is required to fetch tasks.");
      }
      dispatch(setLoading(true));
      const tasks = await getTasks(projectId);
      dispatch(setTasks(tasks));
      return tasks;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createNewTask = createAsyncThunk(
  "tasks/createNewTask",
  async (taskData: Omit<ITask, "id">) => {
    const newTask = await createTask(taskData);

    return newTask;
  }
);

export const updateTaskThunk = createAsyncThunk(
  "tasks/updateTask",
  async (
    { taskId, taskData }: { taskId: string; taskData: Partial<ITask> },
    { dispatch }
  ) => {
    const updatedTask = await updateTaskService(taskId, taskData);
    dispatch(updateTask(updatedTask));
    return updatedTask;
  }
);

export const removeTask = createAsyncThunk(
  "tasks/removeTask",
  async (taskId: string) => {
    try {
      return deleteTaskService(taskId);
    } catch (error) {
      console.error("Error removing task:", error);
      throw error;
    }
  }
);
