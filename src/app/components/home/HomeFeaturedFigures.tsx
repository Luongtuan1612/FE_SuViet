import type { HistoryFigure } from "../../../services/historyService";
import { ImageWithFallback } from "../common/ImageWithFallback";

interface HomeFeaturedFiguresProps {
  figures: HistoryFigure[];
}

export function HomeFeaturedFigures({ figures }: HomeFeaturedFiguresProps) {
  if (figures.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <h2
          className="text-[#8B1A1A] mb-2"
          style={{ fontSize: "1.6rem", fontWeight: 700 }}
        >
          Nhân vật lịch sử liên quan
        </h2>

        <p className="text-gray-600 text-sm">
          Một số nhân vật được liên kết với các sự kiện trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {figures.map((figure) => (
          <div
            key={figure.id || figure.name}
            className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-[#DAA520]/40 hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#F5EDD8] mb-3 border border-[#DAA520]/30">
              {figure.image ? (
                <ImageWithFallback
                  src={figure.image}
                  alt={figure.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
            </div>

            <div className="font-semibold text-gray-800 text-sm line-clamp-2">
              {figure.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}