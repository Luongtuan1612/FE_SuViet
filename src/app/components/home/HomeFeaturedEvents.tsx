import { Link } from "react-router";
import { ArrowRight, CalendarDays, Clock, Landmark, Users } from "lucide-react";
import {
  getCategoryMeta,
  type HistoryEvent,
} from "../../../services/historyService";
import { ImageWithFallback } from "../common/ImageWithFallback";
import { formatYearDisplay } from "../../utils/homeUtils";

interface HomeFeaturedEventsProps {
  events: HistoryEvent[];
}

export function HomeFeaturedEvents({ events }: HomeFeaturedEventsProps) {
  return (
    <div className="bg-[#F5EDD8] py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-medium mb-2">
              <Landmark size={16} />
              Dữ liệu từ cơ sở dữ liệu
            </div>

            <h2
              className="text-[#8B1A1A]"
              style={{ fontSize: "1.6rem", fontWeight: 700 }}
            >
              Sự kiện tiêu biểu
            </h2>

            <p className="text-gray-600 text-sm mt-1">
              Những sự kiện lịch sử nổi bật trong kho dữ liệu SuViet
            </p>
          </div>

          <Link
            to="/su-kien"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#8B1A1A] font-medium hover:gap-2.5 transition-all"
          >
            Xem tất cả
            <ArrowRight size={15} />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
            <div className="text-4xl mb-3">📚</div>

            <h3 className="font-bold text-gray-800 mb-2">
              Chưa có sự kiện lịch sử
            </h3>

            <p className="text-gray-500 text-sm">
              Hãy kiểm tra lại dữ liệu trong database hoặc API lịch sử.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const categoryMeta = getCategoryMeta(event.category);

              return (
                <Link
                  key={event.id}
                  to={`/su-kien/${event.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-white hover:border-[#DAA520]/40"
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryMeta.color}`}
                      >
                        {categoryMeta.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs">
                      <Clock size={12} />
                      {formatYearDisplay(event.year)}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-[#8B4513]/70 text-xs mb-2">
                      <CalendarDays size={12} />
                      {event.period}
                    </div>

                    <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {event.shortSummary}
                    </p>

                    {event.figures && event.figures.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                          <Users size={12} />
                          Nhân vật liên quan
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {event.figures.slice(0, 3).map((figure) => (
                            <span
                              key={figure.id || figure.name}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FBF7F0] text-[#8B4513] text-xs border border-[#DAA520]/20"
                            >
                              {figure.name}
                            </span>
                          ))}

                          {event.figures.length > 3 && (
                            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                              +{event.figures.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                      Đọc chi tiết
                      <ArrowRight
                        size={13}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}