import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { Search, Menu, X, BookOpen, MessageCircle, Trophy, Home, ChevronRight } from "lucide-react";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: "/", label: "Trang chủ", icon: Home },
    { to: "/su-kien", label: "Sự kiện", icon: BookOpen },
    { to: "/hoi-dap-ai", label: "Hỏi đáp AI", icon: MessageCircle },
    { to: "/kiem-tra", label: "Kiểm tra", icon: Trophy },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/su-kien?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF7F0]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#8B1A1A] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 bg-[#DAA520] rounded-full flex items-center justify-center text-white text-lg font-bold shadow">
                🏛️
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-base leading-tight">SuViet</div>
                <div className="text-[#DAA520] text-xs">Học tập thông minh</div>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to))
                      ? "bg-[#DAA520] text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sự kiện..."
                  className="pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/20 focus:border-white/40 w-52 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-[#DAA520] text-white rounded-lg text-sm hover:bg-[#B8960C] transition-colors"
              >
                Tìm
              </button>
            </form>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 space-y-1">
              <form onSubmit={handleSearch} className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full pl-8 pr-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none"
                  />
                </div>
                <button type="submit" className="px-3 py-2 bg-[#DAA520] text-white rounded-lg text-sm">
                  Tìm
                </button>
              </form>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to))
                      ? "bg-[#DAA520] text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Breadcrumb */}
      {location.pathname !== "/" && (
        <div className="bg-[#F5EDD8] border-b border-[#DAA520]/20">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-1 text-sm text-[#8B4513]/70">
              <Link to="/" className="hover:text-[#8B1A1A] transition-colors">Trang chủ</Link>
              {location.pathname.startsWith("/su-kien") && (
                <>
                  <ChevronRight size={13} />
                  <Link to="/su-kien" className="hover:text-[#8B1A1A] transition-colors">Sự kiện lịch sử</Link>
                  {location.pathname !== "/su-kien" && (
                    <>
                      <ChevronRight size={13} />
                      <span className="text-[#8B1A1A]">Chi tiết</span>
                    </>
                  )}
                </>
              )}
              {location.pathname === "/hoi-dap-ai" && (
                <>
                  <ChevronRight size={13} />
                  <span className="text-[#8B1A1A]">Hỏi đáp AI</span>
                </>
              )}
              {location.pathname === "/kiem-tra" && (
                <>
                  <ChevronRight size={13} />
                  <span className="text-[#8B1A1A]">Kiểm tra kiến thức</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#2C1810] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">🏛️</div>
                <div>
                  <div className="font-bold text-[#DAA520]">SuViet</div>
                  <div className="text-xs text-white/60">Học tập thông minh</div>
                </div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Hệ thống học tập lịch sử Việt Nam tích hợp AI, giúp học sinh, sinh viên và người yêu lịch sử tiếp cận kiến thức một cách dễ dàng và thú vị.
              </p>
            </div>
            <div>
              <div className="font-semibold text-[#DAA520] mb-3">Tính năng</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2"><BookOpen size={13} className="text-[#DAA520]" /> Tra cứu sự kiện lịch sử</li>
                <li className="flex items-center gap-2"><MessageCircle size={13} className="text-[#DAA520]" /> Hỏi đáp với AI</li>
                <li className="flex items-center gap-2"><Search size={13} className="text-[#DAA520]" /> Tóm tắt nội dung</li>
                <li className="flex items-center gap-2"><Trophy size={13} className="text-[#DAA520]" /> Kiểm tra trắc nghiệm</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-[#DAA520] mb-3">Dành cho</div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>📚 Học sinh phổ thông</li>
                <li>🎓 Sinh viên đại học</li>
                <li>🌟 Người yêu thích lịch sử</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-white/40">
            © 2026 Suviet. Hệ thống học tập lịch sử tích hợp AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
