import type { FormEvent } from "react";
import { Search, Star } from "lucide-react";
import {
  HOME_HERO_IMAGE,
  QUICK_SEARCH_KEYWORDS,
} from "../../constants/homeConstants";
import { HistoryBookAnimation } from "./HistoryBookAnimation";

interface HomeHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent) => void;
  onQuickSearch: (keyword: string) => void;
}

export function HomeHero({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onQuickSearch,
}: HomeHeroProps) {
  return (
    <div
      className="relative min-h-[640px] flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(139,26,26,0.88), rgba(44,24,16,0.94)), url(${HOME_HERO_IMAGE})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #DAA520 25%, transparent 25%, transparent 75%, #DAA520 75%, #DAA520)",
          backgroundPosition: "0 0",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/60 via-transparent to-[#DAA520]/10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] px-4 py-1.5 rounded-full text-sm mb-6">
              <Star size={13} fill="currentColor" />
              Hệ thống học tập lịch sử tích hợp AI
            </div>

            <h1
              className="text-white mb-4"
              style={{
                fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                fontWeight: 900,
                lineHeight: 1.12,
              }}
            >
              Mở từng trang{" "}
              <span className="text-[#DAA520]">Lịch sử Việt Nam</span>
            </h1>

            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Khám phá sự kiện, nhân vật, triều đại và các mốc son lịch sử qua
              dữ liệu trực quan, trắc nghiệm và trợ lý AI thông minh.
            </p>

            <form
              onSubmit={onSearchSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto lg:mx-0 mb-7"
            >
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder='Ví dụ: "Trận Bạch Đằng", "Nhà Trần"...'
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DAA520] shadow-lg text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-3 bg-[#DAA520] hover:bg-[#B8960C] text-white rounded-xl font-medium text-sm transition-colors shadow-lg"
              >
                Tìm kiếm
              </button>
            </form>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {QUICK_SEARCH_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => onQuickSearch(keyword)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-full text-xs transition-all"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <HistoryBookAnimation />
          </div>
        </div>
      </div>
    </div>
  );
}