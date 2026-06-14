import { History } from "lucide-react";
import type { QuizHistoryItem } from "../../../services/quizService";
import { getDifficultyInfo, getHistoryPercentage } from "../../utils/quizUtils";

interface QuizHistoryListProps {
  history: QuizHistoryItem[];
}

export function QuizHistoryList({ history }: QuizHistoryListProps) {
  if (!localStorage.getItem("token") || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <History size={20} className="text-[#8B1A1A]" />
          Lịch sử làm bài gần đây
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {history.slice(0, 6).map((item) => {
          const percentage = getHistoryPercentage(item);
          const difficultyInfo = getDifficultyInfo(item.difficulty);

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-[#FBF7F0]/60 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">{item.topicEmoji || "📚"}</span>

                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 text-sm line-clamp-1">
                    {item.topicTitle}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] ${difficultyInfo.badgeClass}`}
                    >
                      {difficultyInfo.label}
                    </span>

                    <span className="text-xs text-gray-400">
                      {new Date(item.completedAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div
                  className={`font-bold text-sm ${
                    percentage >= 70 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {percentage}%
                </div>

                <div className="text-xs text-gray-400">
                  {item.score}/{item.totalQuestions}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
