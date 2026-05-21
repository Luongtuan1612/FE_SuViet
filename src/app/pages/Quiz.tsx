import { useState } from "react";
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, BookOpen, Star, Clock } from "lucide-react";
import { quizTopics, QuizTopic, QuizQuestion } from "../data/quizData";
import { Link } from "react-router";

type QuizState = "select" | "playing" | "result";

interface AnswerRecord {
  questionId: string;
  selected: number;
  correct: boolean;
}

function TopicCard({ topic, onSelect }: { topic: QuizTopic; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className="group text-left w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#DAA520]/50 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="text-4xl mb-3">{topic.emoji}</div>
        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors">
          {topic.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">{topic.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BookOpen size={13} />
            {topic.questions.length} câu hỏi
          </div>
          <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium group-hover:gap-2 transition-all">
            Bắt đầu <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </button>
  );
}

function QuizPlayer({
  topic,
  onFinish,
}: {
  topic: QuizTopic;
  onFinish: (answers: AnswerRecord[]) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const question: QuizQuestion = topic.questions[currentIndex];
  const isLast = currentIndex === topic.questions.length - 1;
  const isAnswered = selectedAnswer !== null;

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setAnswers((prev) => [
      ...prev,
      {
        questionId: question.id,
        selected: idx,
        correct: idx === question.correctAnswer,
      },
    ]);
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(answers);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const progress = ((currentIndex) / topic.questions.length) * 100;

  const getOptionClass = (idx: number) => {
    if (!isAnswered) {
      return "bg-white border-gray-200 hover:border-[#8B1A1A]/50 hover:bg-[#FBF7F0] cursor-pointer";
    }
    if (idx === question.correctAnswer) {
      return "bg-green-50 border-green-400 cursor-default";
    }
    if (idx === selectedAnswer && selectedAnswer !== question.correctAnswer) {
      return "bg-red-50 border-red-400 cursor-default";
    }
    return "bg-gray-50 border-gray-200 cursor-default opacity-60";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="font-semibold text-gray-700">{topic.title}</span>
          <span className="text-gray-500">
            {currentIndex + 1} / {topic.questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8B1A1A] to-[#DAA520] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-gray-400 text-right">
          Đã trả lời: {answers.filter((a) => a.correct).length} câu đúng
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 bg-[#8B1A1A] text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
            {currentIndex + 1}
          </div>
          <h2 className="text-gray-800 leading-relaxed" style={{ fontWeight: 600 }}>
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionClass(idx)}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                !isAnswered
                  ? "bg-gray-100 text-gray-600"
                  : idx === question.correctAnswer
                  ? "bg-green-500 text-white"
                  : idx === selectedAnswer
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}>
                {!isAnswered
                  ? String.fromCharCode(65 + idx)
                  : idx === question.correctAnswer
                  ? "✓"
                  : idx === selectedAnswer
                  ? "✗"
                  : String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-sm ${
                isAnswered && idx === question.correctAnswer
                  ? "text-green-700 font-medium"
                  : isAnswered && idx === selectedAnswer && selectedAnswer !== question.correctAnswer
                  ? "text-red-700"
                  : "text-gray-700"
              }`}>
                {option}
              </span>
              {isAnswered && idx === question.correctAnswer && (
                <CheckCircle size={16} className="text-green-500 ml-auto shrink-0" />
              )}
              {isAnswered && idx === selectedAnswer && selectedAnswer !== question.correctAnswer && (
                <XCircle size={16} className="text-red-500 ml-auto shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 mb-4 border ${
          selectedAnswer === question.correctAnswer
            ? "bg-green-50 border-green-200"
            : "bg-orange-50 border-orange-200"
        }`}>
          <div className="flex items-start gap-2">
            {selectedAnswer === question.correctAnswer ? (
              <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle size={16} className="text-orange-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className={`text-sm font-semibold mb-1 ${
                selectedAnswer === question.correctAnswer ? "text-green-700" : "text-orange-700"
              }`}>
                {selectedAnswer === question.correctAnswer ? "Chính xác! 🎉" : "Chưa đúng! 📚"}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-[#8B1A1A] text-white rounded-xl font-medium hover:bg-[#6B1414] transition-colors flex items-center justify-center gap-2"
        >
          {isLast ? (
            <>
              <Trophy size={16} />
              Xem kết quả
            </>
          ) : (
            <>
              Câu tiếp theo <ArrowRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

function QuizResult({
  topic,
  answers,
  onRestart,
  onBack,
}: {
  topic: QuizTopic;
  answers: AnswerRecord[];
  onRestart: () => void;
  onBack: () => void;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const total = topic.questions.length;
  const percentage = Math.round((correct / total) * 100);

  const getScoreInfo = () => {
    if (percentage >= 90) return { label: "Xuất sắc!", emoji: "🏆", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (percentage >= 70) return { label: "Giỏi!", emoji: "⭐", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 50) return { label: "Trung bình", emoji: "📚", color: "text-green-600", bg: "bg-green-50" };
    return { label: "Cần ôn tập thêm", emoji: "💪", color: "text-orange-600", bg: "bg-orange-50" };
  };

  const scoreInfo = getScoreInfo();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Score Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-5 text-center">
        <div className="text-6xl mb-3">{scoreInfo.emoji}</div>
        <h2 className="text-gray-800 mb-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>
          {scoreInfo.label}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{topic.title}</p>

        <div className={`inline-flex items-center gap-3 px-6 py-4 ${scoreInfo.bg} rounded-2xl mb-6`}>
          <div className={`text-4xl font-bold ${scoreInfo.color}`}>{correct}/{total}</div>
          <div className="text-left">
            <div className={`text-lg font-bold ${scoreInfo.color}`}>{percentage}%</div>
            <div className="text-xs text-gray-500">Điểm số</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              percentage >= 70 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400">{correct} câu đúng · {total - correct} câu sai</div>
      </div>

      {/* Answer Review */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-[#8B1A1A]" />
          Xem lại câu trả lời
        </h3>
        <div className="space-y-4">
          {topic.questions.map((q, i) => {
            const answer = answers[i];
            return (
              <div key={q.id} className={`p-4 rounded-xl border ${
                answer?.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-start gap-2 mb-2">
                  {answer?.correct ? (
                    <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={15} className="text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="text-sm font-medium text-gray-800">{q.question}</div>
                </div>
                {!answer?.correct && (
                  <div className="text-xs text-gray-600 ml-5">
                    <span className="text-red-600">Bạn chọn: </span>
                    {q.options[answer?.selected]} |{" "}
                    <span className="text-green-600">Đáp án đúng: </span>
                    {q.options[q.correctAnswer]}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1 ml-5">{q.explanation}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B1A1A] text-white rounded-xl font-medium hover:bg-[#6B1414] transition-colors"
        >
          <RotateCcw size={15} /> Làm lại
        </button>
        <button
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          <Star size={15} /> Chủ đề khác
        </button>
      </div>
    </div>
  );
}

export function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedTopic, setSelectedTopic] = useState<QuizTopic | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const handleSelectTopic = (topic: QuizTopic) => {
    setSelectedTopic(topic);
    setAnswers([]);
    setQuizState("playing");
  };

  const handleFinish = (finalAnswers: AnswerRecord[]) => {
    setAnswers(finalAnswers);
    setQuizState("result");
  };

  const handleRestart = () => {
    setAnswers([]);
    setQuizState("playing");
  };

  const handleBack = () => {
    setSelectedTopic(null);
    setAnswers([]);
    setQuizState("select");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[#8B1A1A] flex items-center justify-center gap-2 mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
          <Trophy size={28} className="text-[#DAA520]" />
          Kiểm tra Kiến thức
        </h1>
        <p className="text-gray-600">Chọn chủ đề và kiểm tra kiến thức lịch sử của bạn</p>
      </div>

      {quizState === "select" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            {[
              { icon: BookOpen, label: "Chủ đề", value: quizTopics.length },
              { icon: Trophy, label: "Câu hỏi", value: quizTopics.reduce((s, t) => s + t.questions.length, 0) },
              { icon: Clock, label: "Phút ước tính", value: "15-20" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <Icon size={18} className="text-[#8B1A1A] mx-auto mb-1" />
                <div className="font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} onSelect={() => handleSelectTopic(topic)} />
            ))}
          </div>

          <div className="mt-8 bg-[#F5EDD8] border border-[#DAA520]/30 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-[#8B4513] mb-1">Muốn ôn luyện thêm?</h3>
            <p className="text-sm text-[#8B4513]/80 mb-3">
              Đọc chi tiết các sự kiện lịch sử trước khi làm bài kiểm tra để đạt kết quả tốt hơn!
            </p>
            <Link
              to="/su-kien"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm hover:bg-[#6B1414] transition-colors"
            >
              <BookOpen size={14} /> Xem sự kiện lịch sử
            </Link>
          </div>
        </>
      )}

      {quizState === "playing" && selectedTopic && (
        <div>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors"
          >
            ← Quay lại chọn chủ đề
          </button>
          <QuizPlayer topic={selectedTopic} onFinish={handleFinish} />
        </div>
      )}

      {quizState === "result" && selectedTopic && (
        <QuizResult
          topic={selectedTopic}
          answers={answers}
          onRestart={handleRestart}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
