import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import {
  Clock,
  Tag,
  User,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import {
  getCategoryMeta,
  historyService,
  HistoryEvent,
} from "../../services/historyService";

const DEFAULT_IMAGE = "https://placehold.co/800x450/png?text=Su+Viet";

export function EventDetail() {
  const { id } = useParams();

  const [event, setEvent] = useState<HistoryEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEventDetail = async () => {
    if (!id) {
      setError("Không tìm thấy mã sự kiện.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [eventDetail, allEvents] = await Promise.all([
        historyService.getArticleById(id),
        historyService.getAllArticles(),
      ]);

      if (!eventDetail) {
        setEvent(null);
        setError("Sự kiện này không tồn tại trong cơ sở dữ liệu.");
        return;
      }

      setEvent(eventDetail);

      const related = allEvents
        .filter(
          (item) =>
            String(item.id) !== String(eventDetail.id) &&
            item.category === eventDetail.category
        )
        .slice(0, 3);

      setRelatedEvents(related);
    } catch (err) {
      console.error("Lỗi tải chi tiết sự kiện:", err);
      setError(
        "Không thể tải chi tiết sự kiện. Hãy kiểm tra Spring Boot API đã chạy chưa."
      );
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/su-kien"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors"
        >
          <ArrowLeft size={15} />
          Quay lại sự kiện
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-72 rounded-2xl bg-gray-100 animate-pulse mb-6" />

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="h-5 bg-gray-100 rounded animate-pulse mb-4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-3" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5" />
            </div>
          </div>

          <div className="space-y-5">
            <div className="h-32 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
            <div className="h-48 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>

        <h2 className="text-gray-700 mb-2" style={{ fontWeight: 700 }}>
          Không tìm thấy sự kiện
        </h2>

        <p className="text-gray-500 mb-6">
          {error || "Sự kiện này không tồn tại trong cơ sở dữ liệu."}
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/su-kien"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg hover:bg-[#6B1414]"
          >
            <ArrowLeft size={15} />
            Quay lại danh sách
          </Link>

          <button
            onClick={loadEventDetail}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#8B1A1A] border border-[#8B1A1A]/20 rounded-lg hover:bg-[#FBF7F0]"
          >
            Tải lại
          </button>
        </div>
      </div>
    );
  }

  const category = getCategoryMeta(event.category);
  const figures = event.figures || [];
  const tags = event.tags || [];

  const getFigureRole = (figure: any) => {
    return (
      figure.role ||
      figure.bornDied ||
      figure.description ||
      "Nhân vật lịch sử liên quan"
    );
  };

  const formatContent = (content: string) => {
    return content
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para, i) => {
        const formatted = para
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(
            /^Ý nghĩa lịch sử:\s*/i,
            "<strong>Ý nghĩa lịch sử:</strong><br />"
          );

        return (
          <p
            key={i}
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formatted }}
          />
        );
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Back button */}
          <Link
            to="/su-kien"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            Quay lại sự kiện
          </Link>

          {/* Hero Image */}
          <div className="relative h-72 rounded-2xl overflow-hidden mb-6 shadow-md">
            <img
              src={event.image || DEFAULT_IMAGE}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
                >
                  {category.label}
                </span>
              </div>

              <h1 className="text-white text-2xl font-bold leading-tight">
                {event.title}
              </h1>

              <div className="flex items-center gap-1 text-white/80 text-sm mt-2">
                <Clock size={13} />
                {event.year} · {event.period}
              </div>
            </div>
          </div>

          {/* Summary short */}
          <div className="bg-[#F5EDD8] border border-[#DAA520]/30 rounded-xl p-4 mb-6">
            <p className="text-[#5C3A1E] text-sm leading-relaxed italic whitespace-pre-line">
              📜 <strong>Tóm tắt:</strong>{" "}
              {event.shortSummary || "Chưa có tóm tắt cho sự kiện này."}
            </p>
          </div>

          {/* Full Content */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2
              className="text-[#8B1A1A] mb-4 flex items-center gap-2"
              style={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              <BookOpen size={18} />
              Nội dung chi tiết
            </h2>

            <div className="prose max-w-none">
              {event.content ? (
                formatContent(event.content)
              ) : (
                <p className="text-gray-500">
                  Chưa có nội dung chi tiết cho sự kiện này.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Tags */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-[#8B1A1A]" />
              Từ khóa
            </h3>

            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#F5EDD8] text-[#8B4513] text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Chưa có từ khóa.</p>
            )}
          </div>

          {/* Historical Figures */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <User size={16} className="text-[#8B1A1A]" />
              Nhân vật lịch sử
            </h3>

            {figures.length > 0 ? (
              <div className="space-y-3">
                {figures.map((figure: any) => (
                  <div
                    key={figure.id || figure.name}
                    className="flex items-start gap-3"
                  >
                    <div className="w-9 h-9 bg-[#8B1A1A] text-white rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5">
                      {figure.name?.[0] || "?"}
                    </div>

                    <div>
                      <div className="font-medium text-gray-800 text-sm">
                        {figure.name}
                      </div>

                      <div className="text-gray-500 text-xs line-clamp-2">
                        {getFigureRole(figure)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Chưa có nhân vật lịch sử liên quan.
              </p>
            )}
          </div>

          {/* Timeline Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-[#8B1A1A]" />
              Thông tin thời gian
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Năm xảy ra:</span>
                <span className="font-medium text-gray-800 text-right">
                  {event.year}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Thời kỳ:</span>
                <span className="font-medium text-gray-800 text-right text-xs">
                  {event.period}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Phân loại:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium text-right ${category.color}`}
                >
                  {category.label}
                </span>
              </div>
            </div>
          </div>

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">
                Sự kiện liên quan
              </h3>

              <div className="space-y-3">
                {relatedEvents.map((related) => (
                  <Link
                    key={related.id}
                    to={`/su-kien/${related.id}`}
                    className="group flex gap-3 hover:bg-[#FBF7F0] rounded-xl p-2 -mx-2 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img
                        src={related.image || DEFAULT_IMAGE}
                        alt={related.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-gray-500 mb-0.5">
                        {related.year}
                      </div>

                      <div className="text-sm font-medium text-gray-700 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                        {related.title}
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      className="text-gray-400 shrink-0 mt-1"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-gradient-to-br from-[#8B1A1A] to-[#5C1111] rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-3">Học thêm về giai đoạn này</h3>

            <div className="space-y-2">
              <Link
                to="/hoi-dap-ai"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ChevronRight size={14} />
                Hỏi đáp AI về sự kiện này
              </Link>

              <Link
                to="/kiem-tra"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ChevronRight size={14} />
                Kiểm tra kiến thức
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}