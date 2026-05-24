import { useState, useEffect } from "react";
import { historyService, HistoryEvent } from "../../services/historyService";
import { useParams, Link } from "react-router";
import { Clock, Tag, User, ArrowLeft, Sparkles, ChevronRight, BookOpen } from "lucide-react";

// Định nghĩa giao diện cho Nhân vật lịch sử hứng từ API
export interface HistoricalFigure {
  id: number;
  name: string;
  bornDied: string;
  description: string;
  story: string;
  image: string;
}

const categoryColors: Record<string, string> = {
  "khoi-nghia": "bg-red-100 text-red-700",
  "chong-ngoai-xam": "bg-orange-100 text-orange-700",
  "trieu-dai": "bg-purple-100 text-purple-700",
  "hien-dai": "bg-blue-100 text-blue-700",
};

const categoryLabels: Record<string, string> = {
  "khoi-nghia": "Khởi nghĩa",
  "chong-ngoai-xam": "Chống ngoại xâm",
  "trieu-dai": "Triều đại",
  "hien-dai": "Hiện đại",
};

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [event, setEvent] = useState<HistoryEvent | null>(null);
  const [figures, setFigures] = useState<HistoricalFigure[]>([]); // State mới lưu danh sách nhân vật
  const [loading, setLoading] = useState(true);

  // GỌI API LẤY SỰ KIỆN VÀ NHÂN VẬT CÙNG LÚC
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setLoading(true);
        try {
          // 1. Lấy chi tiết sự kiện
          const eventData = await historyService.getArticleById(id);
          setEvent(eventData);

          // 2. Lấy danh sách nhân vật tham gia sự kiện này (Gọi thẳng API vừa tạo)
          const figureRes = await fetch(`http://localhost:8080/api/v1/figures/article/${id}`);
          if (figureRes.ok) {
            const figureData = await figureRes.json();
            setFigures(figureData);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowSummary(true);
    }, 1800);
  };

  const formatContent = (content: string) => {
    if (!content) return null;
    return content.split("\n\n").map((para, i) => {
      const formatted = para.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <p
          key={i}
          className="text-gray-700 leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: formatted }}
        />
      );
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#8B1A1A] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Đang tải kiến thức lịch sử...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-gray-700 mb-2" style={{ fontWeight: 700 }}>Không tìm thấy sự kiện</h2>
        <p className="text-gray-500 mb-6">Dữ liệu sự kiện #{id} chưa có trong hệ thống.</p>
        <Link to="/su-kien" className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg hover:bg-[#6B1414]">
          <ArrowLeft size={15} /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: NỘI DUNG CHÍNH */}
        <div className="lg:col-span-2">
          <Link to="/su-kien" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#8B1A1A] mb-6 transition-colors">
            <ArrowLeft size={15} /> Quay lại sự kiện
          </Link>

          <div className="relative h-72 rounded-2xl overflow-hidden mb-6 shadow-md">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[event.category] || "bg-gray-100"}`}>
                  {categoryLabels[event.category] || "Lịch sử"}
                </span>
              </div>
              <h1 className="text-white text-2xl font-bold leading-tight">{event.title}</h1>
              <div className="flex items-center gap-1 text-white/80 text-sm mt-2">
                <Clock size={13} />
                {event.year} · {event.period}
              </div>
            </div>
          </div>

          <div className="bg-[#F5EDD8] border border-[#DAA520]/30 rounded-xl p-4 mb-6">
            <p className="text-[#5C3A1E] text-sm leading-relaxed italic">
              📜 <strong>Tóm tắt:</strong> {event.shortSummary}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-[#8B1A1A] mb-4 flex items-center gap-2" style={{ fontWeight: 700, fontSize: "1.1rem" }}>
              <BookOpen size={18} />
              Nội dung chi tiết
            </h2>
            <div className="prose max-w-none text-justify">
              {formatContent(event.content)}
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mb-6 overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Sparkles size={14} className="text-[#DAA520]" />
                   <span className="font-semibold text-gray-800">Tóm tắt thông minh</span>
                </div>
                {!showSummary && (
                  <button onClick={handleGenerateSummary} className="text-sm bg-[#8B1A1A] text-white px-3 py-1.5 rounded-lg">
                     {isGenerating ? "Đang xử lý..." : "Tạo tóm tắt AI"}
                  </button>
                )}
             </div>
             {showSummary && (
               <div className="p-4 bg-[#FBF7F0] text-sm text-gray-600">
                  Đây là bản tóm tắt được tối ưu cho việc ghi nhớ nhanh sự kiện <strong>{event.title}</strong>.
               </div>
             )}
          </div>
        </div>

        {/* CỘT PHẢI: SIDEBAR */}
        <div className="space-y-5">
          {/* Thẻ Dòng thời gian */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} className="text-[#8B1A1A]" />
              Dòng thời gian
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Năm:</span>
                <span className="font-medium text-gray-800">{event.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời kỳ:</span>
                <span className="font-medium text-gray-800 text-right">{event.period}</span>
              </div>
            </div>
          </div>

          {/* THẺ MỚI: DANH SÁCH NHÂN VẬT LỊCH SỬ */}
          {figures.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User size={16} className="text-[#8B1A1A]" />
                Nhân vật liên quan
              </h3>
              <div className="space-y-4">
                {figures.map((figure) => (
                  <div key={figure.id} className="flex gap-3 items-center p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <img 
                      src={figure.image} 
                      alt={figure.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 shrink-0 shadow-sm"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800 leading-tight mb-0.5">{figure.name}</h4>
                      <p className="text-xs text-gray-500">{figure.bornDied}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Thẻ Quảng cáo trợ lý AI */}
          <div className="bg-gradient-to-br from-[#8B1A1A] to-[#5C1111] rounded-2xl p-5 text-white text-center">
             <h3 className="font-bold mb-2">Bạn có thắc mắc?</h3>
             <p className="text-xs text-white/70 mb-4">Hãy hỏi trợ lý AI để hiểu sâu hơn về sự kiện này.</p>
             <Link to="/hoi-dap-ai" className="inline-block bg-[#DAA520] text-white px-4 py-2 rounded-lg text-sm font-medium">
                Chat với AI ngay
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}