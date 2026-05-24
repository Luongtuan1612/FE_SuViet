import { useState } from "react";
import { Link } from "react-router";
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
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";

type LoginForm = {
  identifier: string;
  password: string;
  remember: boolean;
};

type LoginErrors = Partial<Record<keyof Pick<LoginForm, "identifier" | "password">, string>>;

const initialForm: LoginForm = {
  identifier: "",
  password: "",
  remember: false,
};

export function Login() {
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  
  // Trạng thái quản lý gọi API và báo lỗi
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: LoginErrors = {};

    if (!form.identifier.trim()) {
      nextErrors.identifier = "Vui lòng nhập email hoặc tên đăng nhập.";
    }

  if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } 
    // Tạm thời tắt điều kiện 6 ký tự để test tài khoản "123"
    // else if (form.password.length < 6) {
    //   nextErrors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
    // }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // Hàm xử lý kết nối với Spring Boot
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(""); // Reset lỗi API mỗi lần bấm nút

    if (!validateForm()) {
      return;
    }

    setLoading(true); // Bật hiệu ứng đang tải

    try {
      // Gọi API sang Spring Boot
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form.identifier, // Truyền identifier vào trường username cho khớp với BE
          password: form.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 1. Lưu Thẻ bài (Token) vào két sắt trình duyệt
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("role", data.role);

        // 2. Thông báo và đá về trang chủ
        alert("Đăng nhập thành công! Chào mừng " + data.username);
        window.location.href = "/";
      } else {
        // Nếu sai mật khẩu hoặc tài khoản không tồn tại
        setApiError("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      setApiError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false); // Tắt hiệu ứng tải
    }
  };

  const updateField = <Key extends keyof LoginForm>(key: Key, value: LoginForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
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
              Tiếp tục hành trình khám phá lịch sử Việt Nam cùng SuViet
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-8 items-stretch">
          <div className="hidden lg:flex rounded-2xl overflow-hidden bg-[#2C1810] min-h-[560px] relative">
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
                Lưu lại tiến trình học và quay lại bất cứ khi nào.
              </h2>
              <p className="text-white/75 leading-relaxed max-w-lg">
                Tài khoản SuViet giúp bạn tiếp tục các bài kiểm tra, theo dõi sự kiện đã xem và chuẩn bị cho những chặng học tiếp theo.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <BookOpen className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">Lịch sử Việt Nam</div>
                  <div className="text-white/60 text-sm mt-1">Tra cứu theo chủ đề</div>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <ShieldCheck className="text-[#DAA520] mb-3" size={22} />
                  <div className="text-white font-semibold">Học tập riêng tư</div>
                  <div className="text-white/60 text-sm mt-1">Sẵn sàng mở rộng API</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#DAA520]/20 shadow-sm p-5 sm:p-7 md:p-8">
            <div className="mb-7">
              <div className="w-12 h-12 rounded-xl bg-[#F5EDD8] text-[#8B1A1A] flex items-center justify-center mb-4">
                <Lock size={23} />
              </div>
              <h2 className="text-[#8B1A1A] text-2xl font-bold">Chào mừng trở lại</h2>
              <p className="text-gray-600 text-sm mt-2">
                Nhập thông tin tài khoản để tiếp tục học cùng SuViet.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Hiển thị lỗi từ Backend (nếu có) */}
              {apiError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 font-medium">
                  ⚠️ {apiError}
                </div>
              )}

              <div>
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-800 mb-2">
                  Email hoặc tên đăng nhập
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
                    onChange={(event) => updateField("identifier", event.target.value)}
                    placeholder="vidu@suviet.vn"
                    aria-invalid={Boolean(errors.identifier)}
                    aria-describedby={errors.identifier ? "identifier-error" : undefined}
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
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                    Mật khẩu
                  </label>
                  <Link to="/quen-mat-khau" className="text-sm font-medium text-[#8B1A1A] hover:text-[#DAA520]">
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
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder="Nhập mật khẩu"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
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

              <div className="flex items-center gap-3">
                <Checkbox
                  id="remember"
                  checked={form.remember}
                  onCheckedChange={(checked) => updateField("remember", checked === true)}
                  className="border-[#DAA520]/50 data-[state=checked]:bg-[#8B1A1A] data-[state=checked]:border-[#8B1A1A]"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
                  Ghi nhớ đăng nhập
                </label>
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
                className="w-full h-11 rounded-xl border-[#DAA520]/30 text-gray-800 hover:bg-[#F5EDD8]"
                onClick={() => console.log("SuViet Google login clicked")}
              >
                <span className="flex size-5 items-center justify-center rounded-full bg-white border border-gray-200 text-sm font-bold text-[#4285F4]">
                  G
                </span>
                Đăng nhập bằng Google
              </Button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="font-semibold text-[#8B1A1A] hover:text-[#DAA520]">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}