import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach Authorization token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401/403 responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
