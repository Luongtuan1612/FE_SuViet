import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import {
  Search,
  BookOpen,
  MessageCircle,
  Trophy,
  ArrowRight,
  Clock,
  Star,
  Users,
  CalendarDays,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Landmark,
} from "lucide-react";
import {
  historyService,
  getCategoryMeta,
  type HistoricalPeriod,
  type HistoryEvent,
} from "../../services/historyService";
import { quizService, type QuizTopic } from "../../services/quizService";
import { ImageWithFallback } from "../components/common/ImageWithFallback";

const quickSearchKeywords = [
  "Trận Bạch Đằng",
  "Hai Bà Trưng",
  "Nhà Lý",
  "Nhà Trần",
  "Quang Trung",
  "Điện Biên Phủ",
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "Không thể tải dữ liệu trang chủ.";
}

function formatYearPart(value: string, isRange = false) {
  const num = Number(value.trim());

  if (!Number.isFinite(num)) {
    return value.trim();
  }

  if (num < 0) {
    return `${Math.abs(num)} trước Công nguyên`;
  }

  return isRange ? `${num}` : `năm ${num}`;
}

function formatYearDisplay(year?: string) {
  const rawYear = year?.trim();

  if (!rawYear) {
    return "Không rõ thời gian";
  }

  const rangeMatch = rawYear.match(/^(-?\d+)\s*(?:-|–|—|đến)\s*(-?\d+)$/i);

  if (rangeMatch) {
    return `${formatYearPart(rangeMatch[1], true)} - ${formatYearPart(
      rangeMatch[2],
      true,
    )}`;
  }

  if (/^-?\d+$/.test(rawYear)) {
    return formatYearPart(rawYear);
  }

  return rawYear;
}

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [periods, setPeriods] = useState<HistoricalPeriod[]>([]);
  const [quizTopics, setQuizTopics] = useState<QuizTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const featuredEvents = useMemo(() => {
    return events.slice(0, 3);
  }, [events]);

  const recentEvents = useMemo(() => {
    return events.slice(3, 7);
  }, [events]);

  const featuredFigures = useMemo(() => {
    const figureMap = new Map<string, { id: string; name: string; image?: string }>();

    events.forEach((event) => {
      event.figures?.forEach((figure) => {
        if (!figureMap.has(figure.id)) {
          figureMap.set(figure.id, {
            id: figure.id,
            name: figure.name,
            image: figure.image,
          });
        }
      });
    });

    return Array.from(figureMap.values()).slice(0, 6);
  }, [events]);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const [eventsResult, periodsResult, quizTopicsResult] =
        await Promise.allSettled([
          historyService.getAllArticles(),
          historyService.getAllPeriods(),
          quizService.getAllTopics(),
        ]);

      if (eventsResult.status === "fulfilled") {
        setEvents(eventsResult.value || []);
      } else {
        throw new Error(getErrorMessage(eventsResult.reason));
      }

      if (periodsResult.status === "fulfilled") {
        setPeriods(periodsResult.value || []);
      } else {
        setPeriods([]);
      }

      if (quizTopicsResult.status === "fulfilled") {
        setQuizTopics(quizTopicsResult.value || []);
      } else {
        setQuizTopics([]);
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setEvents([]);
      setPeriods([]);
      setQuizTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/su-kien?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Tra cứu sự kiện",
      desc: "Tìm kiếm và tra cứu thông tin lịch sử Việt Nam được lấy trực tiếp từ cơ sở dữ liệu.",
      color: "bg-red-50 text-red-700",
      iconColor: "text-[#8B1A1A]",
      link: "/su-kien",
    },
    {
      icon: MessageCircle,
      title: "Hỏi đáp AI",
      desc: "Đặt câu hỏi về lịch sử và nhận câu trả lời từ trợ lý AI dựa trên dữ liệu RAG.",
      color: "bg-amber-50 text-amber-700",
      iconColor: "text-[#DAA520]",
      link: "/hoi-dap-ai",
    },
    {
      icon: Trophy,
      title: "Kiểm tra kiến thức",
      desc: "Luyện tập kiến thức lịch sử thông qua các bộ câu hỏi trắc nghiệm theo chủ đề.",
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-700",
      link: "/kiem-tra",
    },
  ];

  if (isLoading) {
    return (
      <div>
        <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden bg-[#8B1A1A]">
          <div className="text-center px-4">
            <div className="w-14 h-14 mx-auto mb-5 rounded-full border-4 border-[#DAA520]/30 border-t-[#DAA520] animate-spin" />
            <h1
              className="text-white mb-3"
              style={{ fontSize: "2rem", fontWeight: 800 }}
            >
              Đang tải dữ liệu SuViet...
            </h1>
            <p className="text-white/70 text-sm">
              Hệ thống đang lấy sự kiện lịch sử từ cơ sở dữ liệu.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="h-40 bg-gray-100 rounded-xl mb-4" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
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
            onClick={loadHomeData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] hover:bg-[#6B1414] text-white rounded-xl text-sm transition-colors"
          >
            <RefreshCw size={15} />
            Thử tải lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative min-h-[540px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,26,26,0.86), rgba(44,24,16,0.92)), url(https://images.unsplash.com/photo-1584815029583-0c95cf1c8a86?auto=format&fit=crop&w=1400&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #DAA520 25%, transparent 25%, transparent 75%, #DAA520 75%, #DAA520)",
            backgroundPosition: "0 0",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#DAA520] px-4 py-1.5 rounded-full text-sm mb-6">
            <Star size={13} fill="currentColor" />
            Hệ thống học tập lịch sử tích hợp AI
          </div>

          <h1
            className="text-white mb-4"
            style={{
              fontSize: "2.8rem",
              fontWeight: 800,
              lineHeight: 1.2,
            }}
          >
            Khám phá{" "}
            <span className="text-[#DAA520]">Lịch sử Việt Nam</span> cùng AI
          </h1>

          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Tra cứu sự kiện, nhân vật, thời kỳ lịch sử và hỏi đáp thông minh dựa
            trên dữ liệu được lưu trong hệ thống SuViet.
          </p>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-7">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Ví dụ: "Trận Bạch Đằng", "Nhà Trần"...'
                className="w-full pl-11 pr-4 py-3 rounded-xl border-0 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DAA520] shadow-lg text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-[#DAA520] hover:bg-[#B8960C] text-white rounded-xl font-medium text-sm transition-colors shadow-lg"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2">
            {quickSearchKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() =>
                  navigate(`/su-kien?q=${encodeURIComponent(keyword)}`)
                }
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-full text-xs transition-all"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#8B1A1A] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {events.length}+
              </div>
              <div className="text-white/70 text-xs">Sự kiện lịch sử</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {periods.length || "Nhiều"}
              </div>
              <div className="text-white/70 text-xs">Thời kỳ lịch sử</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">
                {quizTopics.length || 5}
              </div>
              <div className="text-white/70 text-xs">Chủ đề trắc nghiệm</div>
            </div>

            <div>
              <div className="text-[#DAA520] text-xl font-bold">AI</div>
              <div className="text-white/70 text-xs">Trợ lý thông minh</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2
            className="text-[#8B1A1A] mb-2"
            style={{ fontSize: "1.8rem", fontWeight: 700 }}
          >
            Tính năng nổi bật
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Hệ thống học tập toàn diện với dữ liệu lịch sử, trắc nghiệm và trợ lý
            AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, iconColor, link }) => (
            <Link
              key={title}
              to={link}
              className="group p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-[#DAA520]/30 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <Icon size={24} className={iconColor} />
              </div>

              <h3 className="font-bold text-gray-800 mb-2">{title}</h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {desc}
              </p>

              <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                Khám phá ngay
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div className="bg-[#F5EDD8] py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[#8B1A1A] text-sm font-medium mb-2">
                <Landmark size={16} />
                Dữ liệu từ cơ sở dữ liệu
              </div>

              <h2
                className="text-[#8B1A1A]"
                style={{ fontSize: "1.6rem", fontWeight: 700 }}
              >
                Sự kiện tiêu biểu
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                Những sự kiện lịch sử nổi bật trong kho dữ liệu SuViet
              </p>
            </div>

            <Link
              to="/su-kien"
              className="hidden sm:flex items-center gap-1.5 text-sm text-[#8B1A1A] font-medium hover:gap-2.5 transition-all"
            >
              Xem tất cả
              <ArrowRight size={15} />
            </Link>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-gray-800 mb-2">
                Chưa có sự kiện lịch sử
              </h3>
              <p className="text-gray-500 text-sm">
                Hãy kiểm tra lại dữ liệu trong database hoặc API lịch sử.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEvents.map((event) => {
                const categoryMeta = getCategoryMeta(event.category);

                return (
                  <Link
                    key={event.id}
                    to={`/su-kien/${event.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-white hover:border-[#DAA520]/40"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <ImageWithFallback
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryMeta.color}`}
                        >
                          {categoryMeta.label}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs">
                        <Clock size={12} />
                        {formatYearDisplay(event.year)}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-1.5 text-[#8B4513]/70 text-xs mb-2">
                        <CalendarDays size={12} />
                        {event.period}
                      </div>

                      <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {event.shortSummary}
                      </p>

                      {event.figures && event.figures.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                            <Users size={12} />
                            Nhân vật liên quan
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {event.figures.slice(0, 3).map((figure) => (
                              <span
                                key={figure.id}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FBF7F0] text-[#8B4513] text-xs border border-[#DAA520]/20"
                              >
                                {figure.name}
                              </span>
                            ))}

                            {event.figures.length > 3 && (
                              <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">
                                +{event.figures.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                        Đọc chi tiết
                        <ArrowRight
                          size={13}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured Figures */}
      {featuredFigures.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="text-center mb-8">
            <h2
              className="text-[#8B1A1A] mb-2"
              style={{ fontSize: "1.6rem", fontWeight: 700 }}
            >
              Nhân vật lịch sử liên quan
            </h2>

            <p className="text-gray-600 text-sm">
              Một số nhân vật được liên kết với các sự kiện trong hệ thống
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredFigures.map((figure) => (
              <div
                key={figure.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-center hover:border-[#DAA520]/40 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-[#F5EDD8] mb-3 border border-[#DAA520]/30">
                  {figure.image ? (
                    <ImageWithFallback
                      src={figure.image}
                      alt={figure.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      👤
                    </div>
                  )}
                </div>

                <div className="font-semibold text-gray-800 text-sm line-clamp-2">
                  {figure.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* More Events */}
      {recentEvents.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-[#8B1A1A]"
                style={{ fontSize: "1.6rem", fontWeight: 700 }}
              >
                Khám phá thêm
              </h2>

              <p className="text-gray-600 text-sm mt-1">
                Các sự kiện khác trong cơ sở dữ liệu
              </p>
            </div>

            <Link
              to="/su-kien"
              className="flex items-center gap-1.5 text-sm text-[#8B1A1A] font-medium hover:gap-2.5 transition-all"
            >
              Xem tất cả
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                to={`/su-kien/${event.id}`}
                className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#DAA520]/40 hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs text-[#8B4513]/70 mb-1 flex items-center gap-1">
                    <Clock size={11} />
                    {formatYearDisplay(event.year)}
                  </div>

                  <h3 className="font-bold text-gray-800 text-sm group-hover:text-[#8B1A1A] transition-colors line-clamp-1">
                    {event.title}
                  </h3>

                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {event.shortSummary}
                  </p>

                  {event.figures && event.figures.length > 0 && (
                    <div className="text-xs text-[#8B4513] mt-2 line-clamp-1">
                      Nhân vật:{" "}
                      {event.figures
                        .slice(0, 2)
                        .map((figure) => figure.name)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* AI CTA */}
      <div className="bg-gradient-to-br from-[#8B1A1A] to-[#4A0E0E] py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#DAA520] text-white flex items-center justify-center shadow-lg">
            <Sparkles size={26} />
          </div>

          <h2
            className="text-white mb-3"
            style={{ fontSize: "1.8rem", fontWeight: 700 }}
          >
            Hỏi AI về Lịch sử Việt Nam
          </h2>

          <p className="text-white/70 mb-6 max-w-xl mx-auto">
            Bạn có thể hỏi về sự kiện, nhân vật, triều đại, mốc thời gian hoặc ý
            nghĩa lịch sử. Trợ lý AI sẽ trả lời dựa trên dữ liệu đã nạp vào hệ
            thống.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/hoi-dap-ai"
              className="inline-flex items-center justify-center gap-2 bg-[#DAA520] hover:bg-[#B8960C] text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg"
            >
              <MessageCircle size={18} />
              Hỏi đáp AI ngay
            </Link>

            <Link
              to="/kiem-tra"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              <Trophy size={18} />
              Làm trắc nghiệm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}