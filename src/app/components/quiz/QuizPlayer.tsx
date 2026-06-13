import { useState } from "react";
import {
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  XCircle,
} from "lucide-react";
import type { QuizDifficulty } from "../../../services/quizService";
import { useQuizKeyboard } from "../../hooks/quiz/useQuizKeyboard";
import type { AnswerRecord, UIQuizTopic } from "../../types/quiz";
import { getDifficultyInfo } from "../../utils/quizUtils";

interface QuizPlayerProps {
  topic: UIQuizTopic;
  difficulty: QuizDifficulty;
  onFinish: (answers: AnswerRecord[]) => void;
}

export function QuizPlayer({ topic, difficulty, onFinish }: QuizPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerMap, setAnswerMap] = useState<Record<string, AnswerRecord>>({});

  const question = topic.questions[currentIndex];
  const difficultyInfo = getDifficultyInfo(difficulty);

  const currentAnswer = answerMap[question.id];
  const selectedAnswer = currentAnswer?.selected ?? null;
  const isAnswered = selectedAnswer !== null;

  const answers = Object.values(answerMap);
  const answeredCount = answers.length;
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = topic.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalQuestions - 1;
  const canSubmit = answeredCount === totalQuestions;

  useQuizKeyboard({
    totalQuestions,
    setCurrentIndex,
  });

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= totalQuestions) return;
    setCurrentIndex(index);
  };

  const handleSelect = (idx: number) => {
    if (isAnswered) return;

    setAnswerMap((prev) => ({
      ...prev,
      [question.id]: {
        questionId: question.id,
        selected: idx,
        correct: idx === question.correctAnswer,
      },
    }));
  };

  const handlePrev = () => {
    goToQuestion(currentIndex - 1);
  };

  const handleNext = () => {
    goToQuestion(currentIndex + 1);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      alert(`Bạn còn ${totalQuestions - answeredCount} câu chưa trả lời.`);
      return;
    }

    const orderedAnswers = topic.questions
      .map((q) => answerMap[q.id])
      .filter((answer): answer is AnswerRecord => Boolean(answer));

    onFinish(orderedAnswers);
  };

  const getOptionClass = (idx: number) => {
    if (!isAnswered) {
      return "bg-white border-gray-200 hover:border-[#8B1A1A]/60 hover:bg-[#FBF7F0] hover:shadow-sm cursor-pointer";
    }

    if (idx === question.correctAnswer) {
      return "bg-green-50 border-green-400 cursor-default shadow-sm";
    }

    if (idx === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "bg-red-50 border-red-400 cursor-default shadow-sm";
    }

    return "bg-gray-50 border-gray-200 cursor-default opacity-60";
  };

  const navIconButtonClass =
    "w-11 h-11 rounded-2xl border border-gray-200 bg-white text-gray-500 flex items-center justify-center transition-all duration-200 hover:bg-[#8B1A1A] hover:text-white hover:border-[#8B1A1A] hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-400 disabled:hover:border-gray-200 disabled:hover:shadow-none disabled:active:scale-100";

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <aside className="space-y-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF7F0] flex items-center justify-center text-2xl">
              {topic.emoji}
            </div>

            <div>
              <h3 className="font-bold text-gray-900 line-clamp-1">
                {topic.title}
              </h3>

              <span
                className={`inline-flex mt-1 items-center px-2 py-0.5 rounded-full border text-[11px] ${difficultyInfo.badgeClass}`}
              >
                {difficultyInfo.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="rounded-2xl bg-[#FBF7F0] p-4">
              <div className="text-xs text-gray-500 mb-1">Đã làm</div>
              <div className="text-xl font-bold text-[#8B1A1A]">
                {answeredCount}/{totalQuestions}
              </div>
            </div>

            <div className="rounded-2xl bg-green-50 p-4">
              <div className="text-xs text-gray-500 mb-1">Đúng</div>
              <div className="text-xl font-bold text-green-600">
                {correctCount}
              </div>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>Tiến độ hoàn thành</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B1A1A] to-[#DAA520] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-[#8B1A1A]" />
            Bảng câu hỏi
          </h4>

          <div className="grid grid-cols-5 gap-2">
            {topic.questions.map((item, index) => {
              const answer = answerMap[item.id];
              const active = index === currentIndex;

              return (
                <button
                  key={item.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-all ${
                    active
                      ? "bg-[#8B1A1A] text-white border-[#8B1A1A] scale-105 shadow-md"
                      : answer?.correct
                      ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      : answer && !answer.correct
                      ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-[#8B1A1A]" />
              Đang làm
            </div>

            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-100 border border-green-200" />
              Đúng
            </div>

            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-200" />
              Sai
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirst}
                title="Câu trước - phím ← hoặc A"
                aria-label="Câu trước"
                className={navIconButtonClass}
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLast}
                title="Câu sau - phím → hoặc D"
                aria-label="Câu sau"
                className={navIconButtonClass}
              >
                <ChevronRight size={22} />
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="h-11 flex-1 rounded-2xl bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white font-semibold hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Trophy size={16} />
                Nộp bài
              </button>
            </div>

            <div className="text-center text-xs text-gray-400 mt-3">
              Dùng phím ← / → hoặc A / D để chuyển câu
            </div>

            {!canSubmit && (
              <div className="text-center text-xs text-gray-400 mt-1">
                Còn {totalQuestions - answeredCount} câu chưa trả lời
              </div>
            )}

            {canSubmit && (
              <div className="text-center text-xs text-green-600 mt-1 font-medium">
                Bạn đã trả lời đủ câu hỏi, có thể nộp bài.
              </div>
            )}
          </div>
        </div>
      </aside>

      <main>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-5">
          <div className="flex items-start gap-4 mb-7">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8B1A1A] to-[#DAA520] text-white rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-lg">
              {currentIndex + 1}
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-[#8B1A1A] font-bold mb-2">
                Câu hỏi {currentIndex + 1} / {totalQuestions}
              </div>

              <h2
                className="text-gray-900 leading-relaxed text-lg"
                style={{ fontWeight: 700 }}
              >
                {question.question}
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${getOptionClass(
                  idx
                )}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                    !isAnswered
                      ? "bg-gray-100 text-gray-600"
                      : idx === question.correctAnswer
                      ? "bg-green-500 text-white"
                      : idx === selectedAnswer
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {!isAnswered
                    ? String.fromCharCode(65 + idx)
                    : idx === question.correctAnswer
                    ? "✓"
                    : idx === selectedAnswer
                    ? "✗"
                    : String.fromCharCode(65 + idx)}
                </div>

                <span
                  className={`text-sm leading-relaxed ${
                    isAnswered && idx === question.correctAnswer
                      ? "text-green-700 font-semibold"
                      : isAnswered &&
                        idx === selectedAnswer &&
                        selectedAnswer !== question.correctAnswer
                      ? "text-red-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>

        {isAnswered && (
          <div
            className={`rounded-3xl p-5 border shadow-sm ${
              selectedAnswer === question.correctAnswer
                ? "bg-green-50 border-green-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle
                  size={22}
                  className="text-green-600 shrink-0 mt-0.5"
                />
              ) : (
                <XCircle
                  size={22}
                  className="text-orange-600 shrink-0 mt-0.5"
                />
              )}

              <div>
                <div
                  className={`text-sm font-bold mb-1 ${
                    selectedAnswer === question.correctAnswer
                      ? "text-green-700"
                      : "text-orange-700"
                  }`}
                >
                  {selectedAnswer === question.correctAnswer
                    ? "Chính xác! Bạn đang nắm rất tốt kiến thức này."
                    : "Chưa đúng, hãy xem lại phần giải thích bên dưới."}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
