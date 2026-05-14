import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001/api"
});

// attach token automatically
API.interceptors.request.use((req) => {
  const rawToken = localStorage.getItem("token");
  const token = rawToken?.replace(/^"|"$/g, "");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default API;