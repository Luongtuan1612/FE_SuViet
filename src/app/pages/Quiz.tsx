import { useEffect, useState } from "react";
import {
  Trophy,
  CheckCircle,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Star,
  Clock,
  ShieldCheck,
  Flame,
  Sparkles,
  History,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  Brain,
  BarChart3,
  Loader2,
  Lock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { quizService } from "../../services/quizService";
import type {
  QuizDifficulty,
  QuizHistoryItem,
} from "../../services/quizService";

type QuizState = "select" | "difficulty" | "playing" | "result";

interface AnswerRecord {
  questionId: string;
  selected: number;
  correct: boolean;
}

interface UIQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface UIQuizTopic {
  id: number;
  title: string;
  description: string;
  emoji: string;
  questions: UIQuizQuestion[];
}

interface DifficultyOption {
  id: QuizDifficulty;
  label: string;
  shortLabel: string;
  description: string;
  questionCount: number;
  emoji: string;
  icon: LucideIcon;
  colorClass: string;
  badgeClass: string;
  ringClass: string;
}

const difficultyOptions: DifficultyOption[] = [
  {
    id: "EASY",
    label: "Dễ",
    shortLabel: "Cơ bản",
    description:
      "Các câu hỏi nhận biết, phù hợp để khởi động và ôn lại kiến thức nền.",
    questionCount: 10,
    emoji: "🌱",
    icon: BookOpen,
    colorClass: "from-emerald-500 to-green-600",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ringClass: "group-hover:border-emerald-300 group-hover:bg-emerald-50/40",
  },
  {
    id: "MEDIUM",
    label: "Trung bình",
    shortLabel: "Hiểu sâu",
    description:
      "Cần nắm sự kiện, nhân vật, mốc thời gian và ý nghĩa lịch sử.",
    questionCount: 20,
    emoji: "⭐",
    icon: ShieldCheck,
    colorClass: "from-amber-500 to-orange-500",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    ringClass: "group-hover:border-amber-300 group-hover:bg-amber-50/40",
  },
  {
    id: "HARD",
    label: "Khó",
    shortLabel: "Nâng cao",
    description:
      "Tập trung phân tích, so sánh, đánh giá và liên hệ tiến trình lịch sử.",
    questionCount: 20,
    emoji: "🔥",
    icon: Flame,
    colorClass: "from-red-500 to-rose-600",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    ringClass: "group-hover:border-red-300 group-hover:bg-red-50/40",
  },
];

const getDifficultyInfo = (difficulty?: QuizDifficulty | string | null) => {
  return (
    difficultyOptions.find((item) => item.id === difficulty) ||
    difficultyOptions[0]
  );
};

function Stepper({ state }: { state: QuizState }) {
  const steps = [
    { id: "select", label: "Chủ đề" },
    { id: "difficulty", label: "Mức độ" },
    { id: "playing", label: "Làm bài" },
    { id: "result", label: "Kết quả" },
  ];

  const currentIndex = steps.findIndex((step) => step.id === state);

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-white/80 backdrop-blur rounded-2xl border border-white shadow-sm px-5 py-4">
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => {
            const active = index <= currentIndex;

            return (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    active
                      ? "bg-[#8B1A1A] text-white shadow-md"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index + 1}
                </div>

                <span
                  className={`hidden sm:block text-sm font-medium ${
                    active ? "text-[#8B1A1A]" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>

                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block flex-1 h-0.5 rounded-full ${
                      index < currentIndex ? "bg-[#8B1A1A]" : "bg-gray-100"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TopicCard({
  topic,
  index,
  onSelect,
}: {
  topic: UIQuizTopic;
  index: number;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group relative text-left w-full bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#8B1A1A] via-[#DAA520] to-[#8B1A1A] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute -right-10 -top-10 w-28 h-28 bg-[#F5EDD8] rounded-full opacity-70 group-hover:scale-125 transition-transform duration-500" />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-[#FBF7F0] border border-[#F5EDD8] flex items-center justify-center text-3xl shadow-sm">
            {topic.emoji}
          </div>

          <div className="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-xs text-gray-500">
            #{String(index + 1).padStart(2, "0")}
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-1">
          {topic.title}
        </h3>

        <p className="text-gray-500 text-sm mb-5 leading-relaxed line-clamp-2">
          {topic.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Target size={14} />
            3 mức độ
          </div>

          <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-semibold group-hover:gap-2 transition-all">
            Chọn mức <ArrowRight size={15} />
          </div>
        </div>
      </div>
    </button>
  );
}

function DifficultyCard({
  difficulty,
  onSelect,
  isFetching,
  isLocked,
  isPassed,
  lockMessage,
}: {
  difficulty: DifficultyOption;
  onSelect: () => void;
  isFetching: boolean;
  isLocked: boolean;
  isPassed: boolean;
  lockMessage?: string;
}) {
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

function QuizPlayer({
  topic,
  difficulty,
  onFinish,
}: {
  topic: UIQuizTopic;
  difficulty: QuizDifficulty;
  onFinish: (answers: AnswerRecord[]) => void;
}) {
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

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        event.stopPropagation();

        setCurrentIndex((prev) => {
          if (prev <= 0) return prev;
          return prev - 1;
        });
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        event.stopPropagation();

        setCurrentIndex((prev) => {
          if (prev >= totalQuestions - 1) return prev;
          return prev + 1;
        });
      }
    };

    document.addEventListener("keydown", handleKeyboard, true);

    return () => {
      document.removeEventListener("keydown", handleKeyboard, true);
    };
  }, [totalQuestions]);

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

function QuizResult({
  topic,
  difficulty,
  answers,
  onRestart,
  onBack,
}: {
  topic: UIQuizTopic;
  difficulty: QuizDifficulty;
  answers: AnswerRecord[];
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const total = topic.questions.length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const difficultyInfo = getDifficultyInfo(difficulty);
  const isPassed = percentage >= 70;

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
              className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${
                isPassed
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-700 border-red-200"
              }`}
            >
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

export function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("select");

  const [topics, setTopics] = useState<UIQuizTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<UIQuizTopic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<QuizDifficulty | null>(null);

  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchingDifficulty, setFetchingDifficulty] =
    useState<QuizDifficulty | null>(null);

  useEffect(() => {
    const previousHtmlOverflowX = document.documentElement.style.overflowX;
    const previousBodyOverflowX = document.body.style.overflowX;

    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    return () => {
      document.documentElement.style.overflowX = previousHtmlOverflowX;
      document.body.style.overflowX = previousBodyOverflowX;
    };
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setIsLoading(true);

        const data = await quizService.getAllTopics();

        const formattedTopics: UIQuizTopic[] = data.map((topic) => ({
          id: topic.id,
          title: topic.title,
          description: topic.description || "Chủ đề kiểm tra lịch sử Việt Nam.",
          emoji: topic.emoji || "📚",
          questions: [],
        }));

        setTopics(formattedTopics);
      } catch (error) {
        console.error("Không thể tải danh sách chủ đề:", error);
        alert("Không thể tải danh sách chủ đề quiz!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setHistory([]);
        return;
      }

      try {
        const data = await quizService.getHistory();
        setHistory(data);
      } catch (error) {
        console.error("Không thể lấy lịch sử làm bài:", error);
      }
    };

    if (quizState === "select" || quizState === "difficulty") {
      fetchHistory();
    }
  }, [quizState]);

  const getHistoryPercentage = (item: QuizHistoryItem) => {
    if (!item.totalQuestions || item.totalQuestions <= 0) {
      return 0;
    }

    return Math.round((item.score / item.totalQuestions) * 100);
  };

  const hasPassedDifficulty = (
    topic: UIQuizTopic,
    difficulty: QuizDifficulty
  ) => {
    return history.some((item) => {
      const sameTopic =
        item.topicId === topic.id || item.topicTitle === topic.title;

      const sameDifficulty = item.difficulty === difficulty;
      const percentage = getHistoryPercentage(item);

      return sameTopic && sameDifficulty && percentage >= 70;
    });
  };

  const isDifficultyUnlocked = (
    topic: UIQuizTopic,
    difficulty: QuizDifficulty
  ) => {
    if (difficulty === "EASY") {
      return true;
    }

    if (difficulty === "MEDIUM") {
      return hasPassedDifficulty(topic, "EASY");
    }

    if (difficulty === "HARD") {
      return hasPassedDifficulty(topic, "MEDIUM");
    }

    return false;
  };

  const getLockMessage = (difficulty: QuizDifficulty) => {
    if (difficulty === "MEDIUM") {
      return "Bạn cần đạt từ 70% ở mức Dễ để mở khóa mức Trung bình.";
    }

    if (difficulty === "HARD") {
      return "Bạn cần đạt từ 70% ở mức Trung bình để mở khóa mức Khó.";
    }

    return "";
  };

  const handleSelectTopic = (topic: UIQuizTopic) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(null);
    setAnswers([]);
    setQuizState("difficulty");
  };

  const handleSelectDifficulty = async (difficulty: QuizDifficulty) => {
    if (!selectedTopic) return;

    const unlocked = isDifficultyUnlocked(selectedTopic, difficulty);

    if (!unlocked) {
      alert(getLockMessage(difficulty));
      return;
    }

    setFetchingDifficulty(difficulty);

    try {
      const rawQuestions = await quizService.getQuestionsByTopic(
        selectedTopic.id,
        difficulty
      );

      if (!rawQuestions || rawQuestions.length === 0) {
        alert("Mức độ này hiện chưa có câu hỏi nào trong hệ thống!");
        return;
      }

      const formattedQuestions: UIQuizQuestion[] = rawQuestions.map(
        (question) => ({
          id: question.id.toString(),
          question: question.questionText,
          options: [
            question.optionA,
            question.optionB,
            question.optionC,
            question.optionD,
          ],
          correctAnswer: question.correctAnswer,
          explanation:
            question.explanation || "Chưa có lời giải thích chi tiết.",
        })
      );

      setSelectedTopic({
        ...selectedTopic,
        questions: formattedQuestions,
      });

      setSelectedDifficulty(difficulty);
      setAnswers([]);
      setQuizState("playing");
    } catch (error) {
      console.error("Không thể tải câu hỏi:", error);
      alert("Không thể tải câu hỏi. Vui lòng thử lại!");
    } finally {
      setFetchingDifficulty(null);
    }
  };

  const handleFinish = async (finalAnswers: AnswerRecord[]) => {
    setAnswers(finalAnswers);
    setQuizState("result");

    if (!selectedTopic || !selectedDifficulty) return;

    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const totalCount = selectedTopic.questions.length;
    const percentage =
      totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    const localHistoryItem: QuizHistoryItem = {
      id: Date.now(),
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      topicEmoji: selectedTopic.emoji,
      difficulty: selectedDifficulty,
      score: correctCount,
      totalQuestions: totalCount,
      completedAt: new Date().toISOString(),
    };

    if (percentage >= 70) {
      setHistory((prev) => [localHistoryItem, ...prev]);
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Người dùng chưa đăng nhập, kết quả chỉ lưu tạm trên giao diện.");
      return;
    }

    try {
      await quizService.submitQuiz({
        topicId: selectedTopic.id,
        difficulty: selectedDifficulty,
        score: correctCount,
        totalQuestions: totalCount,
      });

      console.log("Hệ thống SuViet đã ghi nhận điểm số thành công!");
    } catch (error) {
      console.error("Không thể lưu điểm:", error);
    }
  };

  const handleRestart = () => {
    setAnswers([]);
    setQuizState("playing");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setAnswers([]);
    setQuizState("select");
  };

  const handleBackToDifficulty = () => {
    if (selectedTopic) {
      setSelectedTopic({
        ...selectedTopic,
        questions: [],
      });
    }

    setSelectedDifficulty(null);
    setAnswers([]);
    setQuizState("difficulty");
  };

  const totalQuestionsLabel =
    topics.length > 0 ? `${topics.length * 50}+` : "700+";

  return (
    <div className="relative min-h-screen -mx-4 px-4 py-8 overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9ED] via-white to-[#F5EDD8]/60" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#DAA520]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#8B1A1A]/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-[#8B1A1A] via-[#7A1717] to-[#4A0E0E] rounded-[2rem] p-8 md:p-10 text-white shadow-2xl mb-8 overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/10 rounded-full" />
          <div className="absolute right-16 bottom-8 w-24 h-24 bg-[#DAA520]/30 rounded-full blur-xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-5">
                <Brain size={16} className="text-[#FFD36A]" />
                SuViet Learning Quiz
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Kiểm tra kiến thức lịch sử theo cấp độ
              </h1>

              <p className="text-white/75 max-w-2xl leading-relaxed mb-6">
                Hoàn thành từng mức với điểm số từ 70% để mở khóa cấp độ tiếp
                theo.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-xl font-bold">{topics.length || 14}</div>
                  <div className="text-xs text-white/65">Chủ đề</div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-xl font-bold">{totalQuestionsLabel}</div>
                  <div className="text-xs text-white/65">Câu hỏi</div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15">
                  <div className="text-xl font-bold">70%</div>
                  <div className="text-xs text-white/65">Điều kiện mở khóa</div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur border border-white/15 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#DAA520] flex items-center justify-center text-[#4A0E0E]">
                    <Award size={24} />
                  </div>

                  <div>
                    <div className="font-bold">Lộ trình mở khóa</div>
                    <div className="text-sm text-white/65">
                      Dễ → Trung bình → Khó
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {difficultyOptions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                    >
                      <span className="text-sm">
                        {item.emoji} {item.label}
                      </span>
                      <span className="text-sm text-white/70">
                        {item.questionCount} câu
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Stepper state={quizState} />

        {isLoading && quizState === "select" && (
          <div className="text-center py-20 text-gray-500">
            <Loader2
              className="animate-spin mx-auto mb-4 text-[#8B1A1A]"
              size={36}
            />
            Đang tải ngân hàng câu hỏi...
          </div>
        )}

        {!isLoading && quizState === "select" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF7F0] flex items-center justify-center text-[#8B1A1A]">
                  <BookOpen size={22} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {topics.length}
                  </div>
                  <div className="text-sm text-gray-500">Chủ đề lịch sử</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF7F0] flex items-center justify-center text-[#8B1A1A]">
                  <Sparkles size={22} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">3 cấp</div>
                  <div className="text-sm text-gray-500">Dễ · TB · Khó</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FBF7F0] flex items-center justify-center text-[#8B1A1A]">
                  <Lock size={22} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">70%</div>
                  <div className="text-sm text-gray-500">Để mở khóa</div>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Chọn thời kỳ lịch sử
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Bắt đầu bằng cách chọn một chủ đề bạn muốn luyện tập.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {topics.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-16 bg-white rounded-3xl border border-gray-100">
                  Chưa có chủ đề nào trong hệ thống.
                </div>
              ) : (
                topics.map((topic, index) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onSelect={() => handleSelectTopic(topic)}
                  />
                ))
              )}
            </div>

            {localStorage.getItem("token") && history.length > 0 && (
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
                          <span className="text-2xl">
                            {item.topicEmoji || "📚"}
                          </span>

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
                                {new Date(item.completedAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div
                            className={`font-bold text-sm ${
                              percentage >= 70
                                ? "text-green-600"
                                : "text-red-600"
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
            )}

            <div className="mt-8 bg-[#F5EDD8] border border-[#DAA520]/30 rounded-[2rem] p-6 max-w-3xl mx-auto text-center">
              <div className="text-3xl mb-2">📚</div>

              <h3 className="font-bold text-[#8B4513] mb-1">
                Muốn ôn luyện thêm trước khi làm bài?
              </h3>

              <p className="text-sm text-[#8B4513]/80 mb-4">
                Đọc chi tiết các sự kiện lịch sử để hiểu bối cảnh, nhân vật và ý
                nghĩa trước khi làm quiz.
              </p>

              <Link
                to="/su-kien"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#8B1A1A] text-white rounded-2xl text-sm font-semibold hover:bg-[#6B1414] transition-colors"
              >
                <BookOpen size={15} /> Xem sự kiện lịch sử
              </Link>
            </div>
          </>
        )}

        {quizState === "difficulty" && selectedTopic && (
          <div className="max-w-5xl mx-auto">
            <button
              onClick={handleBackToTopics}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors"
            >
              <ChevronLeft size={17} />
              Quay lại chọn thời kỳ
            </button>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 mb-8 text-center">
              <div className="text-6xl mb-4">{selectedTopic.emoji}</div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {selectedTopic.title}
              </h2>

              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                {selectedTopic.description}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBF7F0] border border-[#F5EDD8] text-sm text-[#8B4513]">
                <Lock size={15} />
                Đạt từ 70% để mở khóa mức tiếp theo
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-[#8B1A1A] font-bold text-2xl">
                Chọn cấp độ luyện tập
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Dễ mở sẵn. Trung bình và Khó sẽ mở khi bạn đạt yêu cầu.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {difficultyOptions.map((difficulty) => {
                const locked = !isDifficultyUnlocked(
                  selectedTopic,
                  difficulty.id
                );

                const passed = hasPassedDifficulty(
                  selectedTopic,
                  difficulty.id
                );

                return (
                  <DifficultyCard
                    key={difficulty.id}
                    difficulty={difficulty}
                    onSelect={() => handleSelectDifficulty(difficulty.id)}
                    isFetching={fetchingDifficulty === difficulty.id}
                    isLocked={locked}
                    isPassed={passed}
                    lockMessage={getLockMessage(difficulty.id)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {quizState === "playing" && selectedTopic && selectedDifficulty && (
          <div>
            <button
              onClick={handleBackToDifficulty}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors"
            >
              <ChevronLeft size={17} />
              Quay lại chọn mức độ
            </button>

            <QuizPlayer
              topic={selectedTopic}
              difficulty={selectedDifficulty}
              onFinish={handleFinish}
            />
          </div>
        )}

        {quizState === "result" && selectedTopic && selectedDifficulty && (
          <QuizResult
            topic={selectedTopic}
            difficulty={selectedDifficulty}
            answers={answers}
            onRestart={handleRestart}
            onBack={handleBackToTopics}
          />
        )}
      </div>
    </div>
  );
}