import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";

export const authService = {
  /**
   * Đăng ký người dùng mới
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Đăng nhập
   */
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = (await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )) as ApiResponse<LoginResponse>;

    // Lưu token và user info vào localStorage
    if (response.data?.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response;
  },

  /**
   * Đăng xuất
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  },

  /**
   * Lấy thông tin người dùng hiện tại
   */
  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    return axiosInstance.get(API_ENDPOINTS.AUTH.ME);
  },

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },

  /**
   * Lấy thông tin user từ localStorage
   */
  getStoredUser: (): LoginResponse["user"] | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
