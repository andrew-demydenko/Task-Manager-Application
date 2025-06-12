import apiClient from "./apiClient";
import type { IUser } from "@/types";

export const getUser = async (userName: string) => {
  try {
    const response = await apiClient.get<null, { users: IUser }>(
      `/users/${userName}`
    );
    return response.users;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get<null, { users: IUser[] }>(`/users`);
    return response.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
