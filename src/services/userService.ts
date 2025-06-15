import apiClient from "./apiClient";
import type { IUser } from "@/types";

const getCurrentUser = async () => {
  try {
    const response = await apiClient.get<null, { user: IUser }>(
      "/current-user"
    );
    return response.user;
  } catch (error) {
    console.error("Error while fetching user:", error);
    return null;
  }
};

export const userService = {
  getCurrentUser,
};
