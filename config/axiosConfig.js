import axios from "axios";


const apiClient = axios.create({
  baseURL: "http://192.168.1.11:5000/api/v1",
  timeout: 10000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Optional)
apiClient.interceptors.request.use(
  (config) => {
    // Example: Add Authorization token if needed
    const token = "your_auth_token"; 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
