import { useState } from "react";
import { User } from "lucide-react";
import { getFigureRole } from "../../utils/historyUtils";

interface EventFigureBoxProps {
  figures: any[];
}

function getFigureImage(figure: any) {
  return (
    figure?.image ||
    figure?.imageUrl ||
    figure?.avatar ||
    figure?.photo ||
    figure?.thumbnail ||
    ""
  );
}

function FigureAvatar({ figure }: { figure: any }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = getFigureImage(figure);
  const initial = figure?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#8B1A1A] border-2 border-[#DAA520]/40 shadow-sm shrink-0 mt-0.5 flex items-center justify-center">
      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={figure?.name || "Nhân vật lịch sử"}
          className="w-full h-full object-cover object-center block"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </span>
      )}
    </div>
  );
}

export function EventFigureBox({ figures }: EventFigureBoxProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <User size={16} className="text-[#8B1A1A]" />
        Nhân vật lịch sử
      </h3>

      {figures.length > 0 ? (
        <div className="space-y-3">
          {figures.map((figure) => (
            <div
              key={figure?.id || figure?.name}
              className="flex items-start gap-3"
            >
              <FigureAvatar figure={figure} />

              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-800 text-sm line-clamp-1">
                  {figure?.name || "Nhân vật lịch sử"}
                </div>

                <div className="text-gray-500 text-xs line-clamp-2">
                  {getFigureRole(figure)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">
          Chưa có nhân vật lịch sử liên quan.
        </p>
      )}
    </div>
  );
}