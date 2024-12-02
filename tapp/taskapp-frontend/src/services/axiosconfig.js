// axios.js
import axios from "axios";
import API_URL from "../config";
export const baseURL=`${API_URL}`;

axios.interceptors.request.use(
    async function (config) {
      let token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.baseURL = baseURL;
  
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    (error) => {
      if (error?.response?.status === 403) {
        
      }
      if (error?.response?.status === 401) {
        
      }
      throw error; 
    }
  );
  
  export default axios;