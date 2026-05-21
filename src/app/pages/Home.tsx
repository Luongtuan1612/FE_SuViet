import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, BookOpen, MessageCircle, Trophy, ArrowRight, Clock, Star } from "lucide-react";
import { historyEvents } from "../data/historyData";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const featuredEvents = historyEvents.slice(0, 3);
  const recentEvents = historyEvents.slice(3, 7);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/su-kien?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Tra cứu sự kiện",
      desc: "Tìm kiếm và tra cứu thông tin lịch sử Việt Nam qua các thời kỳ một cách nhanh chóng.",
      color: "bg-red-50 text-red-700",
      iconColor: "text-[#8B1A1A]",
      link: "/su-kien",
    },
    {
      icon: MessageCircle,
      title: "Hỏi đáp AI",
      desc: "Đặt câu hỏi về lịch sử và nhận câu trả lời chi tiết, chính xác từ trợ lý AI thông minh.",
      color: "bg-amber-50 text-amber-700",
      iconColor: "text-[#DAA520]",
      link: "/hoi-dap-ai",
    },
    {
      icon: Trophy,
      title: "Kiểm tra kiến thức",
      desc: "Luyện tập và kiểm tra kiến thức lịch sử qua bộ câu hỏi trắc nghiệm phong phú.",
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-700",
      link: "/kiem-tra",
    },
  ];

  const categoryColors: Record<string, string> = {
    "khoi-nghia": "bg-red-100 text-red-700",
    "chong-ngoai-xam": "bg-orange-100 text-orange-700",
    "trieu-dai": "bg-purple-100 text-purple-700",
    "hien-dai": "bg-blue-100 text-blue-700",
  };

  const categoryLabels: Record<string, string> = {
    "khoi-nghia": "Khởi nghĩa",
    "chong-ngoai-xam": "Chống ngoại xâm",
    "trieu-dai": "Triều đại",
    "hien-dai": "Hiện đại",
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative min-h-[520px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(139,26,26,0.82), rgba(44,24,16,0.9)), url(https://images.unsplash.com/photo-1758782963689-181d6176932f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1200)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #DAA520 25%, transparent 25%, transparent 75%, #DAA520 75%, #DAA520), repeating-linear-gradient(45deg, #DAA520 25%, transparent 25%, transparent 75%, #DAA520 75%, #DAA520)`,
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "20px 20px",
        }} />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] px-4 py-1.5 rounded-full text-sm mb-6">
            <Star size={13} fill="currentColor" />
            Hệ thống học tập lịch sử tích hợp AI
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: "2.8rem", fontWeight: 800, lineHeight: 1.2 }}>
            Khám phá{" "}
            <span className="text-[#DAA520]">Lịch sử Việt Nam</span>{" "}
            cùng AI
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Tra cứu sự kiện, hỏi đáp thông minh, tóm tắt nội dung và kiểm tra kiến thức — tất cả trong một nền tảng duy nhất.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Ví dụ: "Trận Bạch Đằng", "Hai Bà Trưng"...'
                className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DAA520] shadow-lg text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-3 bg-[#DAA520] hover:bg-[#B8960C] text-white rounded-xl font-medium text-sm transition-colors shadow-lg"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {["Trận Bạch Đằng", "Điện Biên Phủ", "Hai Bà Trưng", "Quang Trung", "30/4/1975"].map((q) => (
              <button
                key={q}
                onClick={() => navigate(`/su-kien?q=${encodeURIComponent(q)}`)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-full text-xs transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#8B1A1A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { num: "9+", label: "Sự kiện lịch sử" },
              { num: "5", label: "Chủ đề trắc nghiệm" },
              { num: "30+", label: "Câu hỏi kiểm tra" },
              { num: "AI", label: "Trợ lý thông minh" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="text-[#DAA520] text-xl font-bold">{num}</div>
                <div className="text-white/70 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-[#8B1A1A] mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Tính năng nổi bật</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Hệ thống học tập toàn diện với sự hỗ trợ của trí tuệ nhân tạo</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, iconColor, link }) => (
            <Link
              key={title}
              to={link}
              className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#DAA520]/30 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} className={iconColor} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
              <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                Khám phá ngay <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div className="bg-[#F5EDD8] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#8B1A1A]" style={{ fontSize: "1.6rem", fontWeight: 700 }}>Sự kiện tiêu biểu</h2>
              <p className="text-gray-600 text-sm mt-1">Những trang sử vàng son của dân tộc</p>
            </div>
            <Link
              to="/su-kien"
              className="flex items-center gap-1.5 text-sm text-[#8B1A1A] font-medium hover:gap-2.5 transition-all"
            >
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/su-kien/${event.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[event.category]}`}>
                      {categoryLabels[event.category]}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[#8B4513]/70 text-xs mb-2">
                    <Clock size={12} />
                    {event.year}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{event.shortSummary}</p>
                  <div className="mt-3 flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                    Đọc chi tiết <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* More Events */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-[#8B1A1A] mb-6" style={{ fontSize: "1.6rem", fontWeight: 700 }}>Sự kiện khác</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recentEvents.map((event) => (
            <Link
              key={event.id}
              to={`/su-kien/${event.id}`}
              className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#DAA520]/40 hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-[#8B4513]/70 mb-1 flex items-center gap-1">
                  <Clock size={11} />
                  {event.year}
                </div>
                <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#8B1A1A] transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{event.shortSummary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#8B1A1A] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h2 className="text-white mb-3" style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            Kiểm tra kiến thức của bạn!
          </h2>
          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Làm bài trắc nghiệm về lịch sử Việt Nam để củng cố kiến thức. Có 5 chủ đề với hơn 30 câu hỏi đang chờ bạn!
          </p>
          <Link
            to="/kiem-tra"
            className="inline-flex items-center gap-2 bg-[#DAA520] hover:bg-[#B8960C] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
          >
            <Trophy size={18} />
            Bắt đầu kiểm tra ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
