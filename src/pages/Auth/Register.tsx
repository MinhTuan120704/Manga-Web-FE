import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { authService } from "@/services/auth.service";
import {
  Eye,
  EyeOff,
  Loader2,
  UserCircle,
  Upload,
} from "lucide-react";
import type { RegisterRequest } from "@/types/auth";

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!agreedToTerms) {
      setError("Bạn phải đồng ý với Điều khoản và Chính sách để tiếp tục");
      return;
    }

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
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
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
          src="/mangaria_logo.svg"
          alt="Mangaria Logo"
          className="h-8 w-8 object-contain"
        />
        <span className="font-semibold text-lg hidden sm:inline">Mangaria</span>
      </Link>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <img
              src="/mangaria_logo.svg"
              alt="Mangaria Logo"
              className="h-16 w-16 object-contain"
            />
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
                  <Label
                    htmlFor="reader"
                    className="cursor-pointer flex-1 font-normal"
                  >
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
                  <Label
                    htmlFor="uploader"
                    className="cursor-pointer flex-1 font-normal"
                  >
                    <div className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">Người đăng tải</div>
                        <div className="text-xs text-muted-foreground">
                          Đăng tải và quản lý truyện tranh
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Terms and Policy Checkbox */}
            <div className="flex items-center space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                disabled={loading}
                className="mt-0.5 border-2 border-muted-foreground/50 dark:border-muted-foreground/70 data-[state=checked]:border-primary"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                Tôi đồng ý với{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsDialog(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Điều khoản và Chính sách
                </button>{" "}
                của Mangaria
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 py-6">
            <Button
              type="submit"
              className="w-full h-11 text-base"
              disabled={loading || !agreedToTerms}
            >
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

      {/* Terms and Policy Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Điều khoản và Chính sách của Mangaria</DialogTitle>
            <DialogDescription>
              Vui lòng đọc kỹ các điều khoản và chính sách trước khi sử dụng dịch vụ
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-[50vh] overflow-y-auto pr-4">
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Điều khoản sử dụng</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bằng việc truy cập và sử dụng Mangaria, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. 
                  Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Tài khoản người dùng</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                  <li>Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản.</li>
                  <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
                  <li>Mỗi người dùng chỉ được phép sở hữu một tài khoản.</li>
                  <li>Chúng tôi có quyền đình chỉ hoặc xóa tài khoản vi phạm điều khoản.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Nội dung</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                  <li>Người dùng không được đăng tải nội dung vi phạm bản quyền.</li>
                  <li>Nội dung khiêu dâm, bạo lực quá mức hoặc phân biệt đối xử bị nghiêm cấm.</li>
                  <li>Chúng tôi có quyền xóa bất kỳ nội dung nào vi phạm quy định.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Chính sách bảo mật</h3>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 leading-relaxed">
                  <li>Thông tin cá nhân chỉ được sử dụng cho mục đích cung cấp dịch vụ.</li>
                  <li>Chúng tôi không chia sẻ dữ liệu với bên thứ ba mà không có sự đồng ý của bạn.</li>
                  <li>Dữ liệu được mã hóa và bảo mật theo tiêu chuẩn công nghiệp.</li>
                  <li>Bạn có quyền yêu cầu xóa dữ liệu cá nhân của mình.</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Quyền sở hữu trí tuệ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tất cả nội dung, thiết kế và tính năng của Mangaria đều thuộc quyền sở hữu của chúng tôi hoặc các đối tác được cấp phép. 
                  Bạn không được sao chép, phân phối hoặc sử dụng lại mà không có sự cho phép bằng văn bản.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Giới hạn trách nhiệm</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Mangaria không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp hay gián tiếp nào phát sinh từ việc sử dụng dịch vụ, 
                  bao gồm nhưng không giới hạn ở mất mát dữ liệu, gián đoạn dịch vụ hoặc lỗi hệ thống.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Thay đổi điều khoản</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chúng tôi có quyền cập nhật các điều khoản này bất cứ lúc nào. 
                  Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">8. Liên hệ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: 
                  <span className="text-primary"> mangariaweb@gmail.com</span>
                </p>
              </section>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowTermsDialog(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
