import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { HistoryEvent } from "../../../services/historyService";
import { DEFAULT_EVENT_IMAGE } from "../../constants/historyConstants";

interface RelatedEventsProps {
  relatedEvents: HistoryEvent[];
}

export function RelatedEvents({ relatedEvents }: RelatedEventsProps) {
  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3">Sự kiện liên quan</h3>

      <div className="space-y-3">
        {relatedEvents.map((related) => (
          <Link
            key={related.id}
            to={`/su-kien/${related.id}`}
            className="group flex gap-3 hover:bg-[#FBF7F0] rounded-xl p-2 -mx-2 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
              <img
                src={related.image || DEFAULT_EVENT_IMAGE}
                alt={related.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_EVENT_IMAGE;
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500 mb-0.5">
                {related.year}
              </div>

              <div className="text-sm font-medium text-gray-700 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                {related.title}
              </div>
            </div>

            <ChevronRight size={14} className="text-gray-400 shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
