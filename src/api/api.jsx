import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  encreyptionKey: process.env.REACT_APP_ENCRYPTION_KEY,
});

export default api;
