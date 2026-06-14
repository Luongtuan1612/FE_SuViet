import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  BookOpen,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { authService } from "../../services/authService";

type LoginForm = {
  identifier: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
  identifier: "",
  password: "",
};

export function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: LoginErrors = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = "Vui lòng nhập tên đăng nhập.";
    }

    if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = <Key extends keyof LoginForm>(
    key: Key,
    value: LoginForm[Key],
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
      const data = await authService.login({
        username: form.identifier.trim(),
        password: form.password,
      });

      authService.saveAuthSession(data);

      setSuccessMessage(`Đăng nhập thành công. Chào mừng ${data.username}!`);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "Tên đăng nhập hoặc mật khẩu không đúng.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF7F0]">
      <section className="relative overflow-hidden bg-[#8B1A1A]">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #DAA520 10%, transparent 10%, transparent 50%, #DAA520 50%, #DAA520 60%, transparent 60%, transparent 100%)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 py-10 md:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DAA520]/40 bg-[#DAA520]/15 px-4 py-1.5 text-sm text-[#F7D36A]">
              <ShieldCheck size={14} />
              Không gian học tập cá nhân
            </div>

            <h1 className="mt-5 text-white text-3xl md:text-4xl font-bold leading-tight">
              Đăng nhập vào SuViet
            </h1>

            <p className="mt-3 text-white/80 text-base md:text-lg max-w-xl">
              Tiếp tục hành trình khám phá lịch sử Việt Nam cùng SuViet.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-stretch">
          <div className="hidden lg:flex rounded-2xl overflow-hidden bg-[#2C1810] min-h-[560px] relative">
            <img
              src="https://images.unsplash.com/photo-1584815029583-0c95cf1c8a86?auto=format&fit=crop&w=1200&q=80"
              alt="Không gian lịch sử Việt Nam"
              className="absolute inset-0 w-full h-full object-cover opacity-55"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-[#8B1A1A]/85 via-[#2C1810]/75 to-[#2C1810]" />

            <div className="relative z-10 p-10 flex flex-col justify-end">
              <div className="w-14 h-14 rounded-2xl bg-[#DAA520] text-white flex items-center justify-center shadow-lg mb-5">
                <Landmark size={28} />
              </div>

              <h2 className="text-white text-2xl font-bold mb-3">
                Hành trình lịch sử đang chờ bạn tiếp tục.
              </h2>

              <p className="text-white/75 leading-relaxed max-w-lg">
                Tài khoản SuViet giúp bạn tiếp tục các bài kiểm tra, theo dõi
                sự kiện đã xem và chuẩn bị cho những chặng học tiếp theo.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <BookOpen className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">
                    Lịch sử Việt Nam
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Tra cứu theo chủ đề
                  </div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <ShieldCheck className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">
                    Học tập riêng tư
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Lưu lịch sử học tập
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DAA520]/20 shadow-sm p-5 sm:p-7 md:p-8">
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDD8] text-[#8B1A1A] flex items-center justify-center mb-4">
                <Lock size={23} />
              </div>

              <h2 className="text-[#8B1A1A] text-2xl font-bold">
                Chào mừng trở lại
              </h2>

              <p className="text-gray-600 text-sm mt-2">
                Nhập thông tin tài khoản để tiếp tục học cùng SuViet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                  htmlFor="identifier"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Tên đăng nhập
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                  />

                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    value={form.identifier}
                    onChange={(event) =>
                      updateField("identifier", event.target.value)
                    }
                    placeholder="Nhập tên đăng nhập"
                    aria-invalid={Boolean(errors.identifier)}
                    aria-describedby={
                      errors.identifier ? "identifier-error" : undefined
                    }
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>

                {errors.identifier && (
                  <p id="identifier-error" className="mt-2 text-sm text-red-700">
                    {errors.identifier}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Mật khẩu
                  </label>

                  <Link
                    to="/quen-mat-khau"
                    className="text-sm font-medium text-[#8B1A1A] hover:text-[#DAA520]"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55"
                  />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Nhập mật khẩu"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                    className="h-11 pl-10 pr-11 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#8B4513]/70 hover:text-[#8B1A1A] hover:bg-[#F5EDD8] transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p id="password-error" className="mt-2 text-sm text-red-700">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[#8B1A1A] text-white hover:bg-[#6F1414] shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>

                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-500">hoặc</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled
                className="w-full h-11 rounded-xl border-[#DAA520]/30 text-gray-500 bg-gray-50 cursor-not-allowed"
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-white border border-gray-200 text-sm font-bold text-[#4285F4]">
                  G
                </span>
                Đăng nhập Google đang phát triển
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#8B1A1A] hover:text-[#DAA520]"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}