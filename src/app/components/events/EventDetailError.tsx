import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface EventDetailErrorProps {
  error: string;
  onReload: () => void;
}

export function EventDetailError({ error, onReload }: EventDetailErrorProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🔍</div>

      <h2 className="text-gray-700 mb-2" style={{ fontWeight: 700 }}>
        Không tìm thấy sự kiện
      </h2>

      <p className="text-gray-500 mb-6">
        {error || "Sự kiện này không tồn tại trong cơ sở dữ liệu."}
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link
          to="/su-kien"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg hover:bg-[#6B1414]"
        >
          <ArrowLeft size={15} />
          Quay lại danh sách
        </Link>

        <button
          onClick={onReload}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#8B1A1A] border border-[#8B1A1A]/20 rounded-lg hover:bg-[#FBF7F0]"
        >
          Tải lại
        </button>
      </div>
    </div>
  );
}
