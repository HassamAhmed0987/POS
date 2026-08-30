import axios from "axios";

const api = axios.create({
  baseURL: "", // Connects directly to backend endpoints on current host/port
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
