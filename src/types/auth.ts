// ========== Auth Types ==========

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "reader" | "uploader";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    _id: string;
    username: string;
    role: string;
  };
}
