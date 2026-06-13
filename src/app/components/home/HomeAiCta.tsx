import { Link } from "react-router";
import { MessageCircle, Sparkles, Trophy } from "lucide-react";

export function HomeAiCta() {
  return (
    <div className="bg-gradient-to-br from-[#8B1A1A] to-[#4A0E0E] py-12">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#DAA520] text-white flex items-center justify-center shadow-lg">
          <Sparkles size={26} />
        </div>

        <h2
          className="text-white mb-3"
          style={{ fontSize: "1.8rem", fontWeight: 700 }}
        >
          Hỏi AI về Lịch sử Việt Nam
        </h2>

        <p className="text-white/70 mb-6 max-w-xl mx-auto">
          Bạn có thể hỏi về sự kiện, nhân vật, triều đại, mốc thời gian hoặc ý
          nghĩa lịch sử. Trợ lý AI sẽ trả lời dựa trên dữ liệu đã nạp vào hệ
          thống.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/hoi-dap-ai"
            className="inline-flex items-center justify-center gap-2 bg-[#DAA520] hover:bg-[#B8960C] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
          >
            <MessageCircle size={18} />
            Hỏi đáp AI ngay
          </Link>

          <Link
            to="/kiem-tra"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Trophy size={18} />
            Làm trắc nghiệm
          </Link>
        </div>
      </div>
    </div>
  );
}