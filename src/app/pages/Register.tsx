import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authService } from "../../services/authService";

type RegisterForm = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterErrors = Partial<Record<keyof RegisterForm, string>>;

const initialForm: RegisterForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: RegisterErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ và tên.";
    }

    if (!form.username.trim()) {
      nextErrors.username = "Vui lòng nhập tên đăng nhập.";
    } else if (form.username.trim().length < 3) {
      nextErrors.username = "Tên đăng nhập cần tối thiểu 3 ký tự.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = <Key extends keyof RegisterForm>(
    key: Key,
    value: RegisterForm[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));

    setApiError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const message = await authService.register({
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim(),
        fullName: form.fullName.trim(),
      });

      setSuccessMessage(message || "Đăng ký thành công. Vui lòng đăng nhập.");

      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF7F0] min-h-screen">
      <section className="relative overflow-hidden bg-[#8B1A1A]">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #DAA520 10%, transparent 10%, transparent 50%, #DAA520 50%, #DAA520 60%, transparent 60%, transparent 100%)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DAA520]/40 bg-[#DAA520]/15 px-4 py-1.5 text-sm text-[#F7D36A]">
              <UserPlus size={14} />
              Tham gia cùng cộng đồng
            </div>

            <h1 className="mt-4 text-white text-3xl md:text-4xl font-bold leading-tight">
              Tạo tài khoản SuViet
            </h1>

            <p className="mt-3 text-white/80 text-base md:text-lg max-w-xl">
              Tạo tài khoản để lưu điểm trắc nghiệm, lịch sử trò chuyện AI và
              hành trình học tập của bạn.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 items-stretch">
          <div className="hidden lg:flex rounded-2xl overflow-hidden bg-[#2C1810] min-h-[600px] relative">
            <img
              src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1100&q=80"
              alt="Không gian học tập lịch sử"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/85 via-[#2C1810]/75 to-[#2C1810]" />

            <div className="relative z-10 p-10 flex flex-col justify-end">
              <div className="w-14 h-14 rounded-2xl bg-[#DAA520] text-white flex items-center justify-center shadow-lg mb-5">
                <Landmark size={28} />
              </div>

              <h2 className="text-white text-2xl font-bold mb-3">
                Bắt đầu hành trình khám phá lịch sử.
              </h2>

              <p className="text-white/75 leading-relaxed max-w-lg">
                Chỉ mất 1 phút để tạo tài khoản, bạn có thể sử dụng các tính
                năng học tập, làm trắc nghiệm và trò chuyện với AI chuyên về
                lịch sử Việt Nam.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <ShieldCheck className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">Tài khoản riêng</div>
                  <div className="text-white/60 text-sm mt-1">
                    Lưu tiến trình học
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <UserPlus className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">Tham gia nhanh</div>
                  <div className="text-white/60 text-sm mt-1">
                    Đăng ký đơn giản
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DAA520]/20 shadow-sm p-5 sm:p-7 md:p-8">
            <div className="mb-6">
              <h2 className="text-[#8B1A1A] text-2xl font-bold">
                Đăng ký thành viên
              </h2>

              <p className="text-gray-600 text-sm mt-2">
                Điền thông tin của bạn để tạo tài khoản mới.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {apiError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 font-medium">
                  ⚠️ {apiError}
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-xl border border-green-200 font-medium">
                  ✅ {successMessage}
                </div>
              )}

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Họ và tên
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                  />

                  <Input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Nguyễn Văn A"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Tên đăng nhập
                </label>

                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                  />

                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={(event) =>
                      updateField("username", event.target.value)
                    }
                    placeholder="nguyenvana"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>

                {errors.username && (
                  <p className="mt-1 text-xs text-red-700">
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                  />

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="vidu@gmail.com"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-700">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800 mb-1.5"
                  >
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                    />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(event) =>
                        updateField("password", event.target.value)
                      }
                      placeholder="••••••••"
                      className="h-11 pl-10 pr-9 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8B4513]/70 hover:bg-[#F5EDD8] transition-colors"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-800 mb-1.5"
                  >
                    Xác nhận mật khẩu
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                    />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      placeholder="••••••••"
                      className="h-11 pl-10 pr-9 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8B4513]/70 hover:bg-[#F5EDD8] transition-colors"
                      aria-label={
                        showConfirmPassword
                          ? "Ẩn mật khẩu xác nhận"
                          : "Hiện mật khẩu xác nhận"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-700">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#8B1A1A] text-white hover:bg-[#6F1414] shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#8B1A1A] hover:text-[#DAA520]"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}