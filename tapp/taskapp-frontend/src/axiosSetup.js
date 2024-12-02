import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:7175/api", // Backend API'nin base URL'si
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // JWT token'ı
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Token'ı Authorization
  }
  return config;
});

export default axiosInstance;
