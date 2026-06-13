import { Clock } from "lucide-react";
import type { HistoryEvent } from "../../../services/historyService";
import { getCategoryMeta } from "../../../services/historyService";
import { DEFAULT_EVENT_IMAGE } from "../../constants/historyConstants";

interface EventDetailHeroProps {
  event: HistoryEvent;
}

export function EventDetailHero({ event }: EventDetailHeroProps) {
  const category = getCategoryMeta(event.category);

  return (
    <div className="relative h-72 rounded-2xl overflow-hidden mb-6 shadow-md">
      <img
        src={event.image || DEFAULT_EVENT_IMAGE}
        alt={event.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = DEFAULT_EVENT_IMAGE;
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
          >
            {category.label}
          </span>
        </div>

        <h1 className="text-white text-2xl font-bold leading-tight">
          {event.title}
        </h1>

        <div className="flex items-center gap-1 text-white/80 text-sm mt-2">
          <Clock size={13} />
          {event.year} · {event.period}
        </div>
      </div>
    </div>
  );
}
