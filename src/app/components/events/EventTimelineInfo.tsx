import { Clock } from "lucide-react";
import type { HistoryEvent } from "../../../services/historyService";
import { getCategoryMeta } from "../../../services/historyService";

interface EventTimelineInfoProps {
  event: HistoryEvent;
}

export function EventTimelineInfo({ event }: EventTimelineInfoProps) {
  const category = getCategoryMeta(event.category);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <Clock size={16} className="text-[#8B1A1A]" />
        Thông tin thời gian
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Năm xảy ra:</span>
          <span className="font-medium text-gray-800 text-right">
            {event.year}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Thời kỳ:</span>
          <span className="font-medium text-gray-800 text-right text-xs">
            {event.period}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Phân loại:</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium text-right ${category.color}`}
          >
            {category.label}
          </span>
        </div>
      </div>
    </div>
  );
}
