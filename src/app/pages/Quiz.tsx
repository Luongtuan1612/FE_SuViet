import { useEffect, useState } from "react";
import { Link } from "react-router";
import { BookOpen, ChevronLeft, Loader2, Lock } from "lucide-react";
import { EmptyState, LoadingSpinner } from "../components/common";
import { QuizDifficultyCard } from "../components/quiz/QuizDifficultyCard";
import { QuizHero } from "../components/quiz/QuizHero";
import { QuizHistoryList } from "../components/quiz/QuizHistoryList";
import { QuizPlayer } from "../components/quiz/QuizPlayer";
import { QuizResult } from "../components/quiz/QuizResult";
import { QuizStats } from "../components/quiz/QuizStats";
import { QuizStepper } from "../components/quiz/QuizStepper";
import { QuizTopicCard } from "../components/quiz/QuizTopicCard";
import { difficultyOptions } from "../constants/quizConstants";
import { useLockBodyOverflowX } from "../hooks/quiz/useLockBodyOverflowX";
import type { AnswerRecord, QuizState, UIQuizQuestion, UIQuizTopic } from "../types/quiz";
import {
  getLockMessage,
  hasPassedDifficulty,
  isDifficultyUnlocked,
} from "../utils/quizUtils";
import { quizService } from "../../services/quizService";
import type { QuizDifficulty, QuizHistoryItem } from "../../services/quizService";

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

  useLockBodyOverflowX();

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

  const handleSelectTopic = (topic: UIQuizTopic) => {
    setSelectedTopic(topic);
    setSelectedDifficulty(null);
    setAnswers([]);
    setQuizState("difficulty");
  };

  const handleSelectDifficulty = async (difficulty: QuizDifficulty) => {
    if (!selectedTopic) return;

    const unlocked = isDifficultyUnlocked(history, selectedTopic, difficulty);

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
        <QuizHero
          topicsCount={topics.length}
          totalQuestionsLabel={totalQuestionsLabel}
        />

        <QuizStepper state={quizState} />

        {isLoading && quizState === "select" && (
          <LoadingSpinner text="Đang tải ngân hàng câu hỏi..." />
        )}

        {!isLoading && quizState === "select" && (
          <>
            <QuizStats topicsCount={topics.length} />

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Chọn thời kỳ lịch sử
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Bắt đầu bằng cách chọn một chủ đề bạn muốn luyện tập.
              </p>
            </div>

            {topics.length === 0 ? (
              <EmptyState
                icon="📚"
                title="Chưa có chủ đề nào trong hệ thống"
                description="Hãy kiểm tra dữ liệu quiz trong CSDL hoặc API Spring Boot."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {topics.map((topic, index) => (
                  <QuizTopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onSelect={() => handleSelectTopic(topic)}
                  />
                ))}
              </div>
            )}

            <QuizHistoryList history={history} />

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
                  history,
                  selectedTopic,
                  difficulty.id
                );

                const passed = hasPassedDifficulty(
                  history,
                  selectedTopic,
                  difficulty.id
                );

                return (
                  <QuizDifficultyCard
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
