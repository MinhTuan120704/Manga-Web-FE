import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { authService } from "@/services/auth.service";
import { BookOpen, Eye, EyeOff, Loader2, UserCircle, Upload } from "lucide-react";
import type { RegisterRequest } from "@/types";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "reader",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formData.username.length < 3) {
      setError("Tên người dùng phải có ít nhất 3 ký tự");
      return;
    }

    setLoading(true);

    try {
      // Đăng ký
      await authService.register(formData);
      
      // Tự động đăng nhập sau khi đăng ký thành công
      await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      // Chuyển về trang chủ
      navigate("/");
      window.location.reload();
    } catch (err: unknown) {
      // Xử lý error một cách an toàn
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Đăng ký</CardTitle>
          <CardDescription className="text-base">
            Tạo tài khoản mới để bắt đầu hành trình đọc truyện
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
              <Label htmlFor="username" className="text-sm font-medium">
                Tên người dùng
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                disabled={loading}
                required
                minLength={3}
                className="h-11"
              />
            </div>

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
                  minLength={6}
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
              <p className="text-xs text-muted-foreground mt-1">
                Tối thiểu 6 ký tự
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Xác nhận mật khẩu
              </Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                disabled={loading}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Loại tài khoản</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value: "reader" | "uploader") =>
                  setFormData({ ...formData, role: value })
                }
                disabled={loading}
                className="gap-3"
              >
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="reader" id="reader" />
                  <Label htmlFor="reader" className="cursor-pointer flex-1 font-normal">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Người đọc</div>
                        <div className="text-xs text-muted-foreground">
                          Đọc và theo dõi truyện yêu thích
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="uploader" id="uploader" />
                  <Label htmlFor="uploader" className="cursor-pointer flex-1 font-normal">
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Uploader</div>
                        <div className="text-xs text-muted-foreground">
                          Đăng tải và quản lý truyện tranh
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pb-6">
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </Button>

            <div className="text-sm text-center text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-semibold transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}