import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7175/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;