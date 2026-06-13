import { Link } from "react-router";
import { ArrowRight, BookOpen, MessageCircle, Trophy } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Tra cứu sự kiện",
    desc: "Tìm kiếm và tra cứu thông tin lịch sử Việt Nam được lấy trực tiếp từ cơ sở dữ liệu.",
    color: "bg-red-50 text-red-700",
    iconColor: "text-[#8B1A1A]",
    link: "/su-kien",
  },
  {
    icon: MessageCircle,
    title: "Hỏi đáp AI",
    desc: "Đặt câu hỏi về lịch sử và nhận câu trả lời từ trợ lý AI dựa trên dữ liệu RAG.",
    color: "bg-amber-50 text-amber-700",
    iconColor: "text-[#DAA520]",
    link: "/hoi-dap-ai",
  },
  {
    icon: Trophy,
    title: "Kiểm tra kiến thức",
    desc: "Luyện tập kiến thức lịch sử thông qua các bộ câu hỏi trắc nghiệm theo chủ đề.",
    color: "bg-green-50 text-green-700",
    iconColor: "text-green-700",
    link: "/kiem-tra",
  },
];

export function HomeFeatureCards() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2
          className="text-[#8B1A1A] mb-2"
          style={{ fontSize: "1.8rem", fontWeight: 700 }}
        >
          Tính năng nổi bật
        </h2>

        <p className="text-gray-600 max-w-xl mx-auto">
          Hệ thống học tập toàn diện với dữ liệu lịch sử, trắc nghiệm và trợ lý
          AI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc, color, iconColor, link }) => (
          <Link
            key={title}
            to={link}
            className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#DAA520]/30 transition-all duration-300"
          >
            <div
              className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon size={24} className={iconColor} />
            </div>

            <h3 className="font-bold text-gray-800 mb-2">{title}</h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {desc}
            </p>

            <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
              Khám phá ngay
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}