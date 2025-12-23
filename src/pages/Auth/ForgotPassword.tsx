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
import { authService } from "@/services/auth.service";
import {
  BookOpen,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  KeyRound,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setStep("otp");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.verifyOTP(email, otp);
      setStep("password");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Mã OTP không hợp lệ hoặc đã hết hạn.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      setStep("success");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setError(""); // Clear any previous errors
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setError(err.message as string);
      } else {
        setError("Có lỗi xảy ra khi gửi lại OTP.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepInfo = () => {
    switch (step) {
      case "email":
        return {
          title: "Quên mật khẩu",
          description: "Nhập email của bạn để nhận mã xác thực",
          icon: <Mail className="h-10 w-10 text-primary-foreground" />,
        };
      case "otp":
        return {
          title: "Xác thực OTP",
          description: `Nhập mã 6 chữ số đã được gửi đến ${email}`,
          icon: <KeyRound className="h-10 w-10 text-primary-foreground" />,
        };
      case "password":
        return {
          title: "Đặt mật khẩu mới",
          description: "Nhập mật khẩu mới cho tài khoản của bạn",
          icon: <Lock className="h-10 w-10 text-primary-foreground" />,
        };
      case "success":
        return {
          title: "Thành công!",
          description: "Mật khẩu của bạn đã được đặt lại",
          icon: <CheckCircle2 className="h-10 w-10 text-primary-foreground" />,
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Logo - Top left corner */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
      >
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg hidden sm:inline">
          Mangaria
        </span>
      </Link>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center">
              {stepInfo.icon}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{stepInfo.title}</CardTitle>
          <CardDescription className="text-base">
            {stepInfo.description}
          </CardDescription>
        </CardHeader>

        {/* Step 1: Email Input */}
        {step === "email" && (
          <form onSubmit={handleSendOTP}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
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
                    Đang gửi...
                  </>
                ) : (
                  "Gửi mã xác thực"
                )}
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </CardFooter>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOTP}>
            <CardContent className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Mã OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Nhập mã 6 chữ số"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  disabled={loading}
                  required
                  maxLength={6}
                  className="h-11 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mã OTP có hiệu lực trong 10 phút
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 py-6">
              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>

              <div className="flex items-center justify-between w-full text-sm">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-primary hover:underline font-medium disabled:opacity-50"
                >
                  Gửi lại mã
                </button>
              </div>
            </CardFooter>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === "password" && (
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-5">
              {error && (
                <div className="p-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="h-11"
                />
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
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </CardFooter>
          </form>
        )}

        {/* Step 4: Success */}
        {step === "success" && (
          <CardFooter className="flex flex-col space-y-4 py-6">
            <div className="text-center text-muted-foreground mb-4">
              Mật khẩu của bạn đã được cập nhật thành công. 
              Bạn có thể đăng nhập với mật khẩu mới.
            </div>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-11 text-base"
            >
              Đăng nhập ngay
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
