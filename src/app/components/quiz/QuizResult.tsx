import { CheckCircle, RotateCcw, Star } from "lucide-react";
import type { QuizDifficulty } from "../../../services/quizService";
import { PASS_PERCENTAGE } from "../../constants/quizConstants";
import type { AnswerRecord, UIQuizTopic } from "../../types/quiz";
import { getDifficultyInfo } from "../../utils/quizUtils";

interface QuizResultProps {
  topic: UIQuizTopic;
  difficulty: QuizDifficulty;
  answers: AnswerRecord[];
  onRestart: () => void;
  onBack: () => void;
}

export function QuizResult({
  topic,
  difficulty,
  answers,
  onRestart,
  onBack,
}: QuizResultProps) {
  const correct = answers.filter((a) => a.correct).length;
  const total = topic.questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const difficultyInfo = getDifficultyInfo(difficulty);
  const isPassed = percentage >= PASS_PERCENTAGE;

  const getScoreInfo = () => {
    if (percentage >= 90) {
      return {
        label: "Xuất sắc!",
        message: "Bạn có nền tảng kiến thức rất tốt.",
        emoji: "🏆",
      };
    }

    if (percentage >= 70) {
      return {
        label: "Đạt yêu cầu!",
        message: "Bạn đã đạt từ 70%, mức tiếp theo sẽ được mở khóa.",
        emoji: "⭐",
      };
    }

    if (percentage >= 50) {
      return {
        label: "Chưa mở khóa mức tiếp theo",
        message: "Bạn cần đạt ít nhất 70% để mở khóa mức kế tiếp.",
        emoji: "📚",
      };
    }

    return {
      label: "Cần ôn tập thêm",
      message: "Bạn cần đạt ít nhất 70% để mở khóa mức kế tiếp.",
      emoji: "💪",
    };
  };

  const scoreInfo = getScoreInfo();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-white rounded-[2rem] border border-gray-100 shadow-xl p-8 md:p-10 text-center overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#F5EDD8] rounded-full opacity-70" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#8B1A1A]/10 rounded-full" />

        <div className="relative">
          <div className="text-7xl mb-4">{scoreInfo.emoji}</div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {scoreInfo.label}
          </h2>

          <p className="text-gray-500 mb-4">{scoreInfo.message}</p>

          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#FBF7F0] border border-[#F5EDD8] text-sm text-[#8B4513]">
              {topic.emoji} {topic.title}
            </span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${difficultyInfo.badgeClass}`}
            >
              Mức độ: {difficultyInfo.label}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm ${
                isPassed
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
              {isPassed && <CheckCircle size={14} />}
              {isPassed ? "Đạt mở khóa" : "Chưa đạt 70%"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-3xl bg-[#FBF7F0] p-5">
              <div className="text-xs text-gray-500 mb-1">Điểm số</div>
              <div className="text-3xl font-bold text-[#8B1A1A]">
                {correct}/{total}
              </div>
            </div>

            <div className="rounded-3xl bg-green-50 p-5">
              <div className="text-xs text-gray-500 mb-1">Tỷ lệ đúng</div>
              <div className="text-3xl font-bold text-green-600">
                {percentage}%
              </div>
            </div>

            <div className="rounded-3xl bg-red-50 p-5">
              <div className="text-xs text-gray-500 mb-1">Câu sai</div>
              <div className="text-3xl font-bold text-red-600">
                {total - correct}
              </div>
            </div>
          </div>

          <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                percentage >= 70 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="text-xs text-gray-400 mb-8">
            Điều kiện mở khóa mức tiếp theo: đạt từ 70% trở lên
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#8B1A1A] text-white rounded-2xl font-semibold hover:bg-[#6B1414] transition-colors"
            >
              <RotateCcw size={17} /> Làm lại mức này
            </button>

            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <Star size={17} /> Chọn chủ đề khác
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
