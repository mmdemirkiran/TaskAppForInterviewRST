import axios from "./axiosconfig";
import API_URL from "../config";

export const fetchTasks = async () => {

  try {
    const response = await axios.get(`${API_URL}/Tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};
