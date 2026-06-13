import { RefreshCcw } from "lucide-react";

interface EventsErrorProps {
  error: string;
  onReload: () => void;
}

export function EventsError({ error, onReload }: EventsErrorProps) {
  return (
    <div className="min-h-screen bg-[#F8F3EA]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-red-100 rounded-[28px] p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <h2 className="text-red-700 font-bold text-xl mb-2">
            Không tải được dữ liệu
          </h2>
          <p className="text-red-600 text-sm mb-6">{error}</p>
          <button
            type="button"
            onClick={onReload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#6B1414] transition-colors"
          >
            <RefreshCcw size={16} />
            Tải lại dữ liệu
          </button>
        </div>
      </div>
    </div>
  );
}
