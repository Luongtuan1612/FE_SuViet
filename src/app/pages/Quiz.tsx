import { useState, useEffect } from "react";
import { Trophy, CheckCircle, XCircle, ArrowRight, RotateCcw, BookOpen, Star, Clock } from "lucide-react";
import { Link } from "react-router";
import { quizService } from "../../services/quizService"; // Kết nối với API

type QuizState = "select" | "playing" | "result";

interface AnswerRecord {
  questionId: string;
  selected: number;
  correct: boolean;
}

// --- ĐỊNH NGHĨA LẠI KIỂU DỮ LIỆU CHO KHỚP VỚI GIAO DIỆN ---
export interface UIQuizQuestion {
  id: string;
  question: string;
  options: string[]; // Giao diện cần mảng
  correctAnswer: number;
  explanation: string;
}

export interface UIQuizTopic {
  id: number;
  title: string;
  description: string;
  emoji: string;
  questions: UIQuizQuestion[];
}

function TopicCard({ topic, onSelect, isFetching }: { topic: UIQuizTopic; onSelect: () => void, isFetching: boolean }) {
  return (
    <button
      onClick={onSelect}
      disabled={isFetching}
      className="group text-left w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-[#DAA520]/50 hover:shadow-lg transition-all duration-300 overflow-hidden disabled:opacity-70"
    >
      <div className="p-6">
        <div className="text-4xl mb-3">{topic.emoji}</div>
        <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors">
          {topic.title}
        </h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">{topic.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <BookOpen size={13} />
            Thử thách trực tuyến
          </div>
          <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium group-hover:gap-2 transition-all">
            {isFetching ? "Đang tải..." : "Bắt đầu"} <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </button>
  );
}

function QuizPlayer({ topic, onFinish }: { topic: UIQuizTopic; onFinish: (answers: AnswerRecord[]) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const question: UIQuizQuestion = topic.questions[currentIndex];
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
    if (!isAnswered) return "bg-white border-gray-200 hover:border-[#8B1A1A]/50 hover:bg-[#FBF7F0] cursor-pointer";
    if (idx === question.correctAnswer) return "bg-green-50 border-green-400 cursor-default";
    if (idx === selectedAnswer && selectedAnswer !== question.correctAnswer) return "bg-red-50 border-red-400 cursor-default";
    return "bg-gray-50 border-gray-200 cursor-default opacity-60";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="font-semibold text-gray-700">{topic.title}</span>
          <span className="text-gray-500">{currentIndex + 1} / {topic.questions.length}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#8B1A1A] to-[#DAA520] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 text-xs text-gray-400 text-right">Đã trả lời: {answers.filter((a) => a.correct).length} câu đúng</div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 bg-[#8B1A1A] text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
            {currentIndex + 1}
          </div>
          <h2 className="text-gray-800 leading-relaxed" style={{ fontWeight: 600 }}>{question.question}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button key={idx} onClick={() => handleSelect(idx)} className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${getOptionClass(idx)}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${!isAnswered ? "bg-gray-100 text-gray-600" : idx === question.correctAnswer ? "bg-green-500 text-white" : idx === selectedAnswer ? "bg-red-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                {!isAnswered ? String.fromCharCode(65 + idx) : idx === question.correctAnswer ? "✓" : idx === selectedAnswer ? "✗" : String.fromCharCode(65 + idx)}
              </div>
              <span className={`text-sm ${isAnswered && idx === question.correctAnswer ? "text-green-700 font-medium" : isAnswered && idx === selectedAnswer && selectedAnswer !== question.correctAnswer ? "text-red-700" : "text-gray-700"}`}>
                {option}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`rounded-xl p-4 mb-4 border ${selectedAnswer === question.correctAnswer ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
          <div className="flex items-start gap-2">
            {selectedAnswer === question.correctAnswer ? <CheckCircle size={16} className="text-green-600 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-orange-600 shrink-0 mt-0.5" />}
            <div>
              <div className={`text-sm font-semibold mb-1 ${selectedAnswer === question.correctAnswer ? "text-green-700" : "text-orange-700"}`}>
                {selectedAnswer === question.correctAnswer ? "Chính xác! 🎉" : "Chưa đúng! 📚"}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {isAnswered && (
        <button onClick={handleNext} className="w-full py-3 bg-[#8B1A1A] text-white rounded-xl font-medium hover:bg-[#6B1414] transition-colors flex items-center justify-center gap-2">
          {isLast ? <><Trophy size={16} />Xem kết quả</> : <>Câu tiếp theo <ArrowRight size={16} /></>}
        </button>
      )}
    </div>
  );
}

function QuizResult({ topic, answers, onRestart, onBack }: { topic: UIQuizTopic; answers: AnswerRecord[]; onRestart: () => void; onBack: () => void }) {
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-5 text-center">
        <div className="text-6xl mb-3">{scoreInfo.emoji}</div>
        <h2 className="text-gray-800 mb-1" style={{ fontWeight: 700, fontSize: "1.5rem" }}>{scoreInfo.label}</h2>
        <p className="text-gray-500 text-sm mb-6">{topic.title}</p>

        <div className={`inline-flex items-center gap-3 px-6 py-4 ${scoreInfo.bg} rounded-2xl mb-6`}>
          <div className={`text-4xl font-bold ${scoreInfo.color}`}>{correct}/{total}</div>
          <div className="text-left">
            <div className={`text-lg font-bold ${scoreInfo.color}`}>{percentage}%</div>
            <div className="text-xs text-gray-500">Điểm số</div>
          </div>
        </div>

        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }} />
        </div>
        <div className="text-xs text-gray-400">{correct} câu đúng · {total - correct} câu sai</div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRestart} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B1A1A] text-white rounded-xl font-medium hover:bg-[#6B1414] transition-colors">
          <RotateCcw size={15} /> Làm lại
        </button>
        <button onClick={onBack} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
          <Star size={15} /> Chủ đề khác
        </button>
      </div>
    </div>
  );
}

export function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>("select");
  const [selectedTopic, setSelectedTopic] = useState<UIQuizTopic | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  // --- STATE MỚI CHO API ---
  const [topics, setTopics] = useState<UIQuizTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingTopicId, setFetchingTopicId] = useState<number | null>(null);

  // 1. Tải danh sách chủ đề từ Spring Boot khi mở trang
  useEffect(() => {
    const fetchTopics = async () => {
      const data = await quizService.getAllTopics();
      // Chuyển đổi dữ liệu, tạm thời để mảng questions rỗng
      const formattedTopics: UIQuizTopic[] = data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        emoji: t.emoji,
        questions: []
      }));
      setTopics(formattedTopics);
      setIsLoading(false);
    };
    fetchTopics();
  }, []);
// Tải lịch sử làm bài nếu người dùng đã đăng nhập
  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // Nếu chưa đăng nhập thì thôi không lấy

      try {
        const response = await fetch("http://localhost:8080/api/v1/quizzes/history", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Không thể lấy lịch sử làm bài:", error);
      }
    };
    
    if (quizState === "select") {
      fetchHistory(); // Mỗi khi ở màn hình chọn chủ đề thì cập nhật lịch sử mới nhất
    }
  }, [quizState]);
  // 2. Lấy câu hỏi chi tiết khi người dùng click vào 1 chủ đề
  const handleSelectTopic = async (topic: UIQuizTopic) => {
    setFetchingTopicId(topic.id);
    try {
      const rawQuestions = await quizService.getQuestionsByTopic(topic.id);
      
      if (!rawQuestions || rawQuestions.length === 0) {
        alert("Chủ đề này hiện chưa có câu hỏi nào trong hệ thống!");
        setFetchingTopicId(null);
        return;
      }

      // Xử lý Map 4 đáp án (A,B,C,D) thành mảng options để đưa vào UI
      const formattedQuestions: UIQuizQuestion[] = rawQuestions.map(q => ({
        id: q.id.toString(),
        question: q.questionText,
        options: [q.optionA, q.optionB, q.optionC, q.optionD],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "Chưa có lời giải thích chi tiết."
      }));

      const topicWithQuestions = { ...topic, questions: formattedQuestions };
      setSelectedTopic(topicWithQuestions);
      setAnswers([]);
      setQuizState("playing");
    } catch (error) {
      alert("Không thể tải câu hỏi. Vui lòng thử lại!");
    } finally {
      setFetchingTopicId(null);
    }
  };

  const handleFinish = async (finalAnswers: AnswerRecord[]) => {
    // 1. Vẫn cho hiển thị bảng điểm trên giao diện như cũ
    setAnswers(finalAnswers);
    setQuizState("result");

    // 2. Tính toán số câu đúng và tổng số câu để chuẩn bị gửi lên Server
    const correctCount = finalAnswers.filter((a) => a.correct).length;
    const totalCount = selectedTopic?.questions.length || 0;
    
    // 3. Lục két sắt lấy Thẻ bài VIP (Token) ra
    const token = localStorage.getItem("token");

    // Nếu người dùng chưa đăng nhập thì không làm gì cả (hoặc thông báo nhắc nhở)
    if (!token) {
      console.log("Người dùng chưa đăng nhập, kết quả thi sẽ không được lưu lại.");
      return;
    }

    try {
      // 4. Bắn dữ liệu sang API submit của Spring Boot
      const response = await fetch("http://localhost:8080/api/v1/quizzes/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // KẸP TOKEN VÀO HEADER ĐỂ BÁC BẢO VỆ CHO QUA
        },
        body: JSON.stringify({
          topicId: selectedTopic?.id,
          score: correctCount,
          totalQuestions: totalCount
        })
      });

      if (response.ok) {
        console.log("🎉 Hệ thống SuViet đã ghi nhận điểm số của bạn thành công!");
      } else {
        console.error("Có lỗi xảy ra khi lưu điểm lên máy chủ.");
      }
    } catch (error) {
      console.error("Lỗi kết nối mạng, không thể lưu điểm:", error);
    }
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
      <div className="text-center mb-8">
        <h1 className="text-[#8B1A1A] flex items-center justify-center gap-2 mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
          <Trophy size={28} className="text-[#DAA520]" />
          Kiểm tra Kiến thức
        </h1>
        <p className="text-gray-600">Chọn chủ đề và kiểm tra kiến thức lịch sử của bạn</p>
      </div>

      {isLoading && quizState === "select" && (
        <div className="text-center py-20 text-gray-500">
          <div className="animate-spin w-8 h-8 border-4 border-[#8B1A1A] border-t-transparent rounded-full mx-auto mb-4"></div>
          Đang tải ngân hàng câu hỏi...
        </div>
      )}

      {!isLoading && quizState === "select" && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
            {[
              { icon: BookOpen, label: "Chủ đề", value: topics.length },
              { icon: Trophy, label: "Câu hỏi", value: "Cập nhật liên tục" },
              { icon: Clock, label: "Hệ thống", value: "Online" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                <Icon size={18} className="text-[#8B1A1A] mx-auto mb-1" />
                <div className="font-bold text-gray-800">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-10">Chưa có chủ đề nào trong hệ thống.</div>
            ) : (
              topics.map((topic) => (
                <TopicCard 
                  key={topic.id} 
                  topic={topic} 
                  onSelect={() => handleSelectTopic(topic)} 
                  isFetching={fetchingTopicId === topic.id}
                />
              ))
            )}
          </div>
          {/* --- KHU VỰC HIỂN THỊ LỊCH SỬ LÀM BÀI --- */}
          {localStorage.getItem("token") && history.length > 0 && (
            <div className="mt-12 max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                ⏱️ Lịch sử làm bài gần đây
              </h3>
              <div className="space-y-3">
                {history.map((item) => {
                  const percentage = Math.round((item.score / item.totalQuestions) * 100);
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-[#FBF7F0]/60 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.topicEmoji}</span>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{item.topicTitle}</div>
                          <div className="text-xs text-gray-400">
                            Ngày làm: {new Date(item.completedAt).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-sm ${percentage >= 80 ? "text-green-600" : percentage >= 50 ? "text-amber-600" : "text-red-600"}`}>
                          Đúng: {item.score}/{item.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-400">Tỷ lệ: {percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 bg-[#F5EDD8] border border-[#DAA520]/30 rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-bold text-[#8B4513] mb-1">Muốn ôn luyện thêm?</h3>
            <p className="text-sm text-[#8B4513]/80 mb-3">
              Đọc chi tiết các sự kiện lịch sử trước khi làm bài kiểm tra để đạt kết quả tốt hơn!
            </p>
            <Link to="/su-kien" className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm hover:bg-[#6B1414] transition-colors">
              <BookOpen size={14} /> Xem sự kiện lịch sử
            </Link>
          </div>
        </>
      )}

      {quizState === "playing" && selectedTopic && (
        <div>
          <button onClick={handleBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors">
            ← Quay lại chọn chủ đề
          </button>
          <QuizPlayer topic={selectedTopic} onFinish={handleFinish} />
        </div>
      )}

      {quizState === "result" && selectedTopic && (
        <QuizResult topic={selectedTopic} answers={answers} onRestart={handleRestart} onBack={handleBack} />
      )}
    </div>
  );
}