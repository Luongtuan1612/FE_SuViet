import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

export function EventQuickActions() {
  return (
    <div className="bg-gradient-to-br from-[#8B1A1A] to-[#5C1111] rounded-2xl p-5 text-white">
      <h3 className="font-bold mb-3">Học thêm về giai đoạn này</h3>

      <div className="space-y-2">
        <Link
          to="/hoi-dap-ai"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight size={14} />
          Hỏi đáp AI về sự kiện này
        </Link>

        <Link
          to="/kiem-tra"
          className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
        >
          <ChevronRight size={14} />
          Kiểm tra kiến thức
        </Link>
      </div>
    </div>
  );
}
