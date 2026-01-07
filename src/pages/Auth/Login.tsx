import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authService } from "@/services/auth.service";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { LoginRequest } from "@/types/auth";

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log("Login response:", response);

      if (response) {
        // Đăng nhập thành công
        console.log("Login successful, navigating...");

        // Lấy thông tin user để check role
        const user = authService.getStoredUser();

        // Redirect dựa vào role
        if (user?.role === "admin") {
          navigate("/admin/overview", { replace: true });
        } else if (user?.role === "uploader") {
          navigate("/uploader/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        // If user didn't choose Remember, move stored credentials to sessionStorage
        if (!remember) {
          const token = localStorage.getItem("accessToken");
          const userStr = localStorage.getItem("user");
          if (token) {
            sessionStorage.setItem("accessToken", token);
            localStorage.removeItem("accessToken");
          }
          if (userStr) {
            sessionStorage.setItem("user", userStr);
            localStorage.removeItem("user");
          }
        }

        // Delay ngắn để đảm bảo navigation hoàn tất trước khi reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      // Xử lý error một cách an toàn
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Logo - Top left corner */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
      >
        <img
          src="/mangaria_logo.png"
          alt="Mangaria Logo"
          className="h-10 w-10 object-contain"
        />
        <span className="font-semibold text-lg hidden sm:inline">Mangaria</span>
      </Link>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <img
              src="/mangaria_logo.png"
              alt="Mangaria Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold">Đăng nhập</CardTitle>
          <CardDescription className="text-base">
            Nhập thông tin tài khoản để tiếp tục đọc truyện
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Mật khẩu
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  disabled={loading}
                  required
                  className="h-11 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-11 w-11 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  <span className="text-sm">Ghi nhớ tài khoản</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 py-6">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Đăng ký ngay
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
