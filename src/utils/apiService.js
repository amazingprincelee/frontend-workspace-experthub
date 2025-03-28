import axios from "axios";



const apiService = axios.create({
   baseURL: "https://backend-workspace-experthub.onrender.com",
  // baseURL: "http://localhost:3002/",
  withCredentials: false,
});

export default apiService;
