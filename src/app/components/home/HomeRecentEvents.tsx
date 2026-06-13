import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import type { HistoryEvent } from "../../../services/historyService";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { formatYearDisplay } from "../../utils/homeUtils";

interface HomeRecentEventsProps {
  events: HistoryEvent[];
}

export function HomeRecentEvents({ events }: HomeRecentEventsProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-14">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-[#8B1A1A]"
            style={{ fontSize: "1.6rem", fontWeight: 700 }}
          >
            Khám phá thêm
          </h2>

          <p className="text-gray-600 text-sm mt-1">
            Các sự kiện khác trong cơ sở dữ liệu
          </p>
        </div>

        <Link
          to="/su-kien"
          className="flex items-center gap-1.5 text-sm text-[#8B1A1A] font-medium hover:gap-2.5 transition-all"
        >
          Xem tất cả
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {events.map((event) => (
          <Link
            key={event.id}
            to={`/su-kien/${event.id}`}
            className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#DAA520]/40 hover:shadow-md transition-all"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs text-[#8B4513]/70 mb-1 flex items-center gap-1">
                <Clock size={11} />
                {formatYearDisplay(event.year)}
              </div>

              <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#8B1A1A] transition-colors line-clamp-1">
                {event.title}
              </h3>

              <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                {event.shortSummary}
              </p>

              {event.figures && event.figures.length > 0 && (
                <div className="text-xs text-[#8B4513] mt-2 line-clamp-1">
                  Nhân vật:{" "}
                  {event.figures
                    .slice(0, 2)
                    .map((figure) => figure.name)
                    .join(", ")}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}