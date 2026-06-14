import { ArrowRight, CheckCircle, Loader2, Lock, Sparkles } from "lucide-react";
import type { DifficultyOption } from "../../types/quiz";

interface QuizDifficultyCardProps {
  difficulty: DifficultyOption;
  onSelect: () => void;
  isFetching: boolean;
  isLocked: boolean;
  isPassed: boolean;
  lockMessage?: string;
}

export function QuizDifficultyCard({
  difficulty,
  onSelect,
  isFetching,
  isLocked,
  isPassed,
  lockMessage,
}: QuizDifficultyCardProps) {
  const Icon = difficulty.icon;

  return (
    <button
      onClick={onSelect}
      disabled={isFetching || isLocked}
      className={`group relative w-full text-left bg-white rounded-3xl border shadow-sm p-6 transition-all duration-300 overflow-hidden ${
        isLocked
          ? "border-gray-100 opacity-70 cursor-not-allowed"
          : "border-gray-100 hover:shadow-xl hover:-translate-y-1 " +
            difficulty.ringClass
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          isLocked ? "from-gray-300 to-gray-400" : difficulty.colorClass
        }`}
      />

      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              isLocked
                ? "bg-gray-100 text-gray-400"
                : `bg-gradient-to-br ${difficulty.colorClass} text-white`
            }`}
          >
            {isLocked ? <Lock size={24} /> : <Icon size={24} />}
          </div>

          <div>
            <div className="text-2xl mb-1">
              {isLocked ? "🔒" : difficulty.emoji}
            </div>

            <h3 className="font-bold text-gray-900 text-lg">
              {difficulty.label}
            </h3>
          </div>
        </div>

        {!isLocked && (
          <ArrowRight
            size={20}
            className="text-gray-300 group-hover:text-[#8B1A1A] group-hover:translate-x-1 transition-all"
          />
        )}
      </div>

      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${
          isLocked
            ? "bg-gray-50 text-gray-500 border-gray-200"
            : isPassed
            ? "bg-green-50 text-green-700 border-green-200"
            : difficulty.badgeClass
        }`}
      >
        {isLocked ? (
          <Lock size={13} />
        ) : isPassed ? (
          <CheckCircle size={13} />
        ) : (
          <Sparkles size={13} />
        )}

        {isPassed
          ? "Đã đạt từ 70%"
          : `${difficulty.questionCount} câu · ${difficulty.shortLabel}`}
      </div>

      <p className="text-sm text-gray-500 leading-relaxed min-h-[64px]">
        {isLocked ? lockMessage : difficulty.description}
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span
          className={`text-sm font-semibold ${
            isLocked ? "text-gray-400" : "text-[#8B1A1A]"
          }`}
        >
          {isLocked
            ? "Chưa mở khóa"
            : isFetching
            ? "Đang tải câu hỏi..."
            : isPassed
            ? "Làm lại mức này"
            : "Bắt đầu thử thách"}
        </span>

        {isFetching && !isLocked && (
          <Loader2 size={18} className="animate-spin text-[#8B1A1A]" />
        )}
      </div>
    </button>
  );
}
