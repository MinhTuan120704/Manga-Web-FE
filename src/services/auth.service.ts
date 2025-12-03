import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "@/types";

export const authService = {
  /**
   * Đăng ký người dùng mới
   */
  register: async (data: RegisterRequest): Promise<User> => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /**
   * Đăng nhập
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    ) as LoginResponse;

    // Lưu token và user info vào localStorage
    if (response?.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
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
  getCurrentUser: async (): Promise<{ user: User }> => {
    return axiosInstance.get(API_ENDPOINTS.AUTH.USER);
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

  /**
   * Đổi mật khẩu
   */
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    return axiosInstance.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },
};
