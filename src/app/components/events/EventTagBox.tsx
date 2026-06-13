import { Tag } from "lucide-react";

interface EventTagBoxProps {
  tags: string[];
}

export function EventTagBox({ tags }: EventTagBoxProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Tag size={16} className="text-[#8B1A1A]" />
        Từ khóa
      </h3>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#F5EDD8] text-[#8B4513] text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Chưa có từ khóa.</p>
      )}
    </div>
  );
}
