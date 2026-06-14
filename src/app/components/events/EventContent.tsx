import { BookOpen } from "lucide-react";
import { formatEventContent } from "../../utils/historyUtils";

interface EventContentProps {
  content?: string;
}

export function EventContent({ content }: EventContentProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <h2
        className="text-[#8B1A1A] mb-4 flex items-center gap-2"
        style={{ fontWeight: 700, fontSize: "1.1rem" }}
      >
        <BookOpen size={18} />
        Nội dung chi tiết
      </h2>

      <div className="prose max-w-none">
        {content ? (
          formatEventContent(content)
        ) : (
          <p className="text-gray-500">
            Chưa có nội dung chi tiết cho sự kiện này.
          </p>
        )}
      </div>
    </div>
  );
}
