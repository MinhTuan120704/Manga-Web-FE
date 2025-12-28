import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/endpoints";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";
import type { User } from "@/types/user";

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
    const response = (await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )) as LoginResponse;

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
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
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
    return !!(
      localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
    );
  },

  /**
   * Lấy thông tin user từ localStorage
   */
  getStoredUser: (): LoginResponse["user"] | null => {
    const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
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

  /**
   * Gửi yêu cầu quên mật khẩu (gửi OTP qua email)
   */
  forgotPassword: async (email: string): Promise<{ status: string; message: string }> => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },

  /**
   * Xác minh mã OTP
   */
  verifyOTP: async (email: string, otp: string): Promise<{ status: string; message: string }> => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
  },

  /**
   * Đặt lại mật khẩu mới
   */
  resetPassword: async (data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ status: string; message: string }> => {
    return axiosInstance.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};
