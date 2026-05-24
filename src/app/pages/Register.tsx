import { useState } from "react";
import { Link } from "react-router"; // (Hoặc react-router-dom)
import {
  BookOpen,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  Mail,
  ShieldCheck,
  User,
  UserPlus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

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
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trạng thái quản lý gọi API
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: RegisterErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ và tên.";
    if (!form.username.trim()) nextErrors.username = "Vui lòng nhập tên đăng nhập.";
    
    if (!form.email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Mật khẩu cần tối thiểu 6 ký tự.";
    }

    if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Gửi dữ liệu khớp với RegisterRequest trong Spring Boot
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          email: form.email,
          fullName: form.fullName,
        }),
      });

      // Lưu ý: Backend đang trả về String (ResponseEntity.ok("Đăng ký thành công")) 
      // nên ta dùng response.text() thay vì response.json()
      const data = await response.text(); 

      if (response.ok) {
        alert(data); // Hiện thông báo "Đăng ký tài khoản thành công!"
        window.location.href = "/login"; // Đá người dùng sang trang đăng nhập
      } else {
        setApiError(data); // Hiện thông báo lỗi từ Backend (vd: Tên đăng nhập đã tồn tại)
      }
    } catch (error) {
      setApiError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại!");
    } finally {
      setLoading(false);
    }
  };

  const updateField = <Key extends keyof RegisterForm>(key: Key, value: RegisterForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
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
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-8 items-stretch">
          
          {/* Cột trái: Hình ảnh giới thiệu */}
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
                Chỉ mất 1 phút để tạo tài khoản, bạn sẽ mở khóa toàn bộ tính năng: lưu trữ điểm thi trắc nghiệm, tạo dấu trang sự kiện, và trò chuyện trực tiếp với AI chuyên gia lịch sử.
              </p>
            </div>
          </div>

          {/* Cột phải: Form đăng ký */}
          <div className="bg-white rounded-2xl border border-[#DAA520]/20 shadow-sm p-5 sm:p-7 md:p-8">
            <div className="mb-6">
              <h2 className="text-[#8B1A1A] text-2xl font-bold">Đăng ký thành viên</h2>
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

              {/* HỌ VÀ TÊN */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55" />
                  <Input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-red-700">{errors.fullName}</p>}
              </div>

              {/* TÊN ĐĂNG NHẬP */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Tên đăng nhập</label>
                <div className="relative">
                  <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55" />
                  <Input
                    type="text"
                    value={form.username}
                    onChange={(e) => updateField("username", e.target.value)}
                    placeholder="nguyenvana123"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>
                {errors.username && <p className="mt-1 text-xs text-red-700">{errors.username}</p>}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55" />
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="vidu@suviet.vn"
                    className="h-11 pl-10 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-700">{errors.email}</p>}
              </div>

              {/* MẬT KHẨU VÀ XÁC NHẬN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Mật khẩu</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="••••••••"
                      className="h-11 pl-10 pr-9 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8B4513]/70 hover:bg-[#F5EDD8] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-700">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1.5">Xác nhận mật khẩu</label>
                  <div className="relative">
                    <Lock size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/55" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      className="h-11 pl-10 pr-9 rounded-xl bg-[#FBF7F0] border-[#DAA520]/25 focus-visible:border-[#DAA520] focus-visible:ring-[#DAA520]/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#8B4513]/70 hover:bg-[#F5EDD8] transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-700">{errors.confirmPassword}</p>}
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
              <Link to="/login" className="font-semibold text-[#8B1A1A] hover:text-[#DAA520]">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}