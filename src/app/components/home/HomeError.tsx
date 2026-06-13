import { AlertCircle, RefreshCw } from "lucide-react";

interface HomeErrorProps {
  errorMessage: string;
  onRetry: () => void;
}

export function HomeError({ errorMessage, onRetry }: HomeErrorProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
          <AlertCircle size={28} />
        </div>

        <h1
          className="text-[#8B1A1A] mb-2"
          style={{ fontSize: "1.6rem", fontWeight: 700 }}
        >
          Không tải được dữ liệu trang chủ
        </h1>

        <p className="text-gray-600 text-sm mb-6">{errorMessage}</p>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1414] text-white rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={15} />
          Thử tải lại
        </button>
      </div>
    </div>
  );
}