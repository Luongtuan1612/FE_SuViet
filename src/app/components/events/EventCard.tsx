import { Link } from "react-router";
import { ArrowRight, Clock } from "lucide-react";
import type { HistoryEvent } from "../../../services/historyService";
import { getCategoryMeta } from "../../../services/historyService";
import { DEFAULT_EVENT_IMAGE } from "../../constants/historyConstants";

interface EventCardProps {
  event: HistoryEvent;
}

export function EventCard({ event }: EventCardProps) {
  const category = getCategoryMeta(event.category);

  return (
    <Link
      to={`/su-kien/${event.id}`}
      className="group h-full bg-white rounded-[26px] overflow-hidden border border-[#eadfce] hover:border-[#DAA520] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-52 overflow-hidden bg-[#F5EDD8]">
        <img
          src={event.image || DEFAULT_EVENT_IMAGE}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_EVENT_IMAGE;
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${category.color}`}
          >
            {category.label}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <div className="inline-flex items-center gap-1.5 text-white/90 text-xs bg-black/25 backdrop-blur-sm rounded-full px-2.5 py-1 mb-2">
            <Clock size={12} />
            {event.year}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-gray-900 font-bold text-lg leading-snug line-clamp-2 mb-3 group-hover:text-[#8B1A1A] transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {event.shortSummary}
        </p>

        {event.figures.length > 0 && (
          <div className="mb-5">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              Nhân vật liên quan
            </div>

            <div className="flex flex-wrap gap-1.5">
              {event.figures.slice(0, 3).map((figure) => (
                <span
                  key={figure.id}
                  className="px-2.5 py-1 bg-[#FFF7E6] text-[#8B4513] border border-[#eadfce] text-xs rounded-full"
                >
                  {figure.name}
                </span>
              ))}

              {event.figures.length > 3 && (
                <span className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 text-xs rounded-full">
                  +{event.figures.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[#f0e6d7]">
          <div className="flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 text-[#8B1A1A] text-sm font-bold group-hover:text-[#6B1414] transition-colors">
              Xem chi tiết
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
