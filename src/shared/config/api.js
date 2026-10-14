import axios from "axios";

export const API_URL = "http://10.114.12.64:8100";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

export default api;
