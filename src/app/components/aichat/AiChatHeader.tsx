import { RotateCcw, Sparkles } from "lucide-react";

interface AiChatHeaderProps {
  onReset: () => void;
}

export function AiChatHeader({ onReset }: AiChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1
          className="text-[#8B1A1A] flex items-center gap-2"
          style={{ fontSize: "1.8rem", fontWeight: 700 }}
        >
          <Sparkles size={24} className="text-[#DAA520]" />
          Hỏi đáp AI Lịch sử
        </h1>

        <p className="text-gray-600 text-sm mt-1">
          Trợ lý AI trả lời dựa trên kho dữ liệu lịch sử Việt Nam đã được nạp
          vào hệ thống
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-[#8B1A1A] border border-gray-200 rounded-lg hover:border-[#8B1A1A]/30 transition-all"
      >
        <RotateCcw size={14} /> Chat mới
      </button>
    </div>
  );
}