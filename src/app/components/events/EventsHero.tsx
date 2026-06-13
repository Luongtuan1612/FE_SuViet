import { Sparkles } from "lucide-react";

interface EventsHeroProps {
  totalEvents: number;
  totalCategories: number;
  visibleEvents: number;
}

export function EventsHero({
  totalEvents,
  totalCategories,
  visibleEvents,
}: EventsHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#8B1A1A] via-[#9d2424] to-[#5d1111] text-white shadow-lg mb-7">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#DAA520]/30 blur-3xl" />
      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

      <div className="relative p-6 md:p-8 lg:p-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/12 border border-white/20 text-sm mb-5">
          <Sparkles size={15} />
          Dữ liệu lấy trực tiếp từ cơ sở dữ liệu SuViet
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7 items-end">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Sự kiện Lịch sử Việt Nam
            </h1>
            <p className="text-white/82 leading-relaxed max-w-3xl">
              Khám phá các sự kiện lịch sử theo nhóm chủ đề như khởi nghĩa,
              chiến tranh, triều đại, văn hóa, cách mạng và thời kỳ hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{totalEvents}</div>
              <div className="text-xs text-white/75 mt-1">Sự kiện</div>
            </div>
            <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{totalCategories}</div>
              <div className="text-xs text-white/75 mt-1">Nhóm</div>
            </div>
            <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{visibleEvents}</div>
              <div className="text-xs text-white/75 mt-1">Đang hiện</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
