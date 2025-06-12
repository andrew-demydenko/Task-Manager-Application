import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const token = window.localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh token logic
    }

    return Promise.reject(error);
  }
);

export default apiClient;
