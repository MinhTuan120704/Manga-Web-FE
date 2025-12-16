import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    // Kiểm tra xem backend có trả về lồng 2 lần wrap status, data không
    if (
      response.data &&
      typeof response.data === "object" &&
       "status" in response.data &&
      "data" in response.data &&
      typeof response.data.data === "object"
    ) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      return Promise.reject(data);
    } else if (error.request) {
      return Promise.reject({ message: "Không thể kết nối đến server" });
    } else {
      return Promise.reject({ message: error.message });
    }
  }
);

export default axiosInstance;
