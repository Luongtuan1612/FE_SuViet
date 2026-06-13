import { useState } from "react";
import { BookOpen, Pause, Play, Sparkles } from "lucide-react";
import {
  FLIPPING_BOOK_PAGES,
  HISTORY_TIMELINE_ITEMS,
} from "../../constants/homeConstants";

export function HistoryBookAnimation() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div
      className={`relative w-full max-w-md mx-auto hidden lg:block ${
        isPaused ? "history-book-paused" : ""
      }`}
    >
      <style>
        {`
          @keyframes bookFloat {
            0%, 100% {
              transform: translateY(0px) rotateX(6deg) rotateY(-10deg);
            }
            50% {
              transform: translateY(-14px) rotateX(8deg) rotateY(-14deg);
            }
          }

          @keyframes multiPageFlip {
            0% {
              transform: rotateY(0deg);
              opacity: 0;
            }
            5% {
              opacity: 1;
            }
            18% {
              transform: rotateY(0deg);
              opacity: 1;
            }
            42% {
              transform: rotateY(-165deg);
              opacity: 0.95;
            }
            58% {
              transform: rotateY(-175deg);
              opacity: 0;
            }
            100% {
              transform: rotateY(-175deg);
              opacity: 0;
            }
          }

          @keyframes timelineMove {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }

          @keyframes goldGlow {
            0%, 100% {
              box-shadow: 0 0 24px rgba(218, 165, 32, 0.25);
            }
            50% {
              box-shadow: 0 0 48px rgba(218, 165, 32, 0.55);
            }
          }

          @keyframes particleFloat {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.35;
            }
            50% {
              transform: translateY(-18px) scale(1.1);
              opacity: 0.85;
            }
          }

          @keyframes pageLineMove {
            0%, 100% {
              width: 55%;
              opacity: 0.45;
            }
            50% {
              width: 85%;
              opacity: 0.8;
            }
          }

          .history-book {
            transform-style: preserve-3d;
            animation: bookFloat 5s ease-in-out infinite;
          }

          .history-flip-page {
            transform-origin: left center;
            transform-style: preserve-3d;
            animation-name: multiPageFlip;
            animation-duration: 8s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            opacity: 0;
            backface-visibility: visible;
          }

          .history-timeline-track {
            animation: timelineMove 10s linear infinite;
          }

          .history-gold-glow {
            animation: goldGlow 3s ease-in-out infinite;
          }

          .history-particle {
            animation: particleFloat 4s ease-in-out infinite;
          }

          .history-page-line {
            animation: pageLineMove 2.4s ease-in-out infinite;
          }
        .history-book-paused .history-book,
        .history-book-paused .history-flip-page,
        .history-book-paused .history-timeline-track,
        .history-book-paused .history-gold-glow,
        .history-book-paused .history-particle,
        .history-book-paused .history-page-line {
        animation-play-state: paused !important;
}
        `}
      </style>

      <div className="absolute -inset-10 bg-[#DAA520]/20 blur-3xl rounded-full" />
      <div className="absolute right-4 top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute left-4 bottom-6 w-28 h-28 bg-[#8B1A1A]/30 rounded-full blur-2xl" />

      <div className="history-particle absolute top-8 left-8 text-[#DAA520] text-xl">
        ✦
      </div>

      <div
        className="history-particle absolute top-20 right-8 text-white/70 text-lg"
        style={{ animationDelay: "1s" }}
      >
        ✧
      </div>

      <div
        className="history-particle absolute bottom-14 left-16 text-[#DAA520]/80 text-2xl"
        style={{ animationDelay: "2s" }}
      >
        ✦
      </div>

      <div
        className="history-book relative z-10 w-[390px] h-[310px] mx-auto cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setIsPaused((prev) => !prev)}
        title={isPaused ? "Bấm để chạy tiếp" : "Bấm để dừng lật trang"}
      >
        <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 w-72 h-12 bg-black/35 blur-xl rounded-full" />

        <div className="absolute left-[70px] top-[30px] w-[260px] h-[230px] rounded-r-2xl bg-[#5C1111] rotate-[-3deg] shadow-2xl" />

        <div className="absolute left-[35px] top-[20px] w-[165px] h-[245px] rounded-l-2xl bg-[#F5EDD8] border border-[#DAA520]/40 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-[#DAA520]/20" />

          <div className="relative p-5 h-full">
            <div className="flex items-center gap-2 text-[#8B1A1A] font-bold mb-4">
              <BookOpen size={18} />
              SuViet
            </div>

            <div className="space-y-2">
              <div className="history-page-line h-2 rounded-full bg-[#8B1A1A]/25" />
              <div
                className="history-page-line h-2 rounded-full bg-[#8B1A1A]/18"
                style={{ animationDelay: "0.3s" }}
              />
              <div
                className="history-page-line h-2 rounded-full bg-[#8B1A1A]/18"
                style={{ animationDelay: "0.6s" }}
              />
            </div>

            <div className="mt-6 rounded-xl border border-[#DAA520]/40 bg-white/45 p-3">
              <div className="text-[11px] text-[#8B4513] mb-1">
                Dòng chảy lịch sử
              </div>

              <div className="text-[#8B1A1A] text-xl font-extrabold">
                Việt Nam
              </div>

              <div className="mt-2 h-1 w-full rounded-full bg-[#DAA520]/50" />
            </div>

            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-[10px] text-[#8B4513]/70 italic">
                “Dân ta phải biết sử ta”
              </div>
            </div>
          </div>
        </div>

        <div className="history-gold-glow absolute left-[195px] top-[20px] w-[165px] h-[245px] rounded-r-2xl bg-[#FFF8E7] border border-[#DAA520]/50 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-white via-transparent to-[#DAA520]/10" />

          <div className="relative h-full overflow-hidden p-4">
            <div className="text-center mb-3">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#8B1A1A]/10 text-[#8B1A1A] text-[10px] font-semibold">
                <Sparkles size={10} />
                Timeline
              </div>
            </div>

            <div className="relative h-[185px] overflow-hidden">
              <div className="history-timeline-track space-y-3">
                {[...HISTORY_TIMELINE_ITEMS, ...HISTORY_TIMELINE_ITEMS].map(
                  (item, index) => (
                    <div
                      key={`${item.year}-${index}`}
                      className="relative pl-4 border-l border-[#DAA520]/50"
                    >
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#DAA520] border border-white" />

                      <div className="text-[10px] font-bold text-[#8B1A1A]">
                        {item.year}
                      </div>

                      <div className="text-[11px] font-semibold text-gray-800 leading-tight">
                        {item.title}
                      </div>

                      <div className="text-[9px] text-gray-500 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        {FLIPPING_BOOK_PAGES.map((page, index) => (
          <div
            key={page.title}
            className="history-flip-page absolute left-[195px] top-[20px] w-[158px] h-[245px] rounded-r-2xl border border-[#DAA520]/30 shadow-xl overflow-hidden"
            style={{
              animationDelay: page.delay,
              zIndex: 30 - index,
              background:
                index % 2 === 0
                  ? "linear-gradient(90deg, rgba(218,165,32,0.22), #FFFDF4 40%, #FFFFFF)"
                  : "linear-gradient(90deg, rgba(139,26,26,0.12), #FFF8E7 45%, #FFFFFF)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#DAA520]/15 via-white/50 to-white/90" />

            <div className="relative p-4 h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[10px] font-bold text-[#8B1A1A]">
                  {page.year}
                </div>

                <div className="w-5 h-5 rounded-full bg-[#DAA520]/20 flex items-center justify-center text-[10px]">
                  {index + 1}
                </div>
              </div>

              <div className="text-center mb-3">
                <div className="w-16 h-16 rounded-full border border-[#DAA520]/50 bg-white/70 mx-auto flex items-center justify-center text-3xl shadow-sm">
                  {page.icon}
                </div>
              </div>

              <div className="text-center text-[12px] font-bold text-[#8B1A1A] leading-tight mb-3">
                {page.title}
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-[85%] bg-gray-300/60 rounded-full" />
                <div className="h-1.5 w-[70%] bg-gray-300/50 rounded-full" />
                <div className="h-1.5 w-[90%] bg-gray-300/50 rounded-full" />
                <div className="h-1.5 w-[58%] bg-gray-300/50 rounded-full" />
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="h-1 w-full rounded-full bg-[#DAA520]/40" />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute left-[184px] top-[20px] w-5 h-[245px] bg-gradient-to-r from-[#5C1111] to-[#8B1A1A] shadow-lg z-40" />

        <div className="absolute left-[315px] top-[35px] w-8 h-8 border-t-4 border-r-4 border-[#DAA520]/70 rounded-tr-xl z-50" />
        <div className="absolute left-[315px] top-[222px] w-8 h-8 border-b-4 border-r-4 border-[#DAA520]/70 rounded-br-xl z-50" />
      </div>
    </div>
  );
}
