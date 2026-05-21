import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { Search, Filter, Clock, ArrowRight, X } from "lucide-react";
import { historyService, HistoryEvent } from "../../services/historyService";

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

const categories = [
  { id: "all", label: "Tất cả" },
  { id: "trieu-dai", label: "Triều đại" },
  { id: "hien-dai", label: "Hiện đại" }
];

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("all");

  const [allEvents, setAllEvents] = useState<HistoryEvent[]>([]); 
  const [filteredEvents, setFilteredEvents] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. GỌI API LẤY DỮ LIỆU
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await historyService.getAllArticles();
      setAllEvents(data);       
      setFilteredEvents(data);  
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  // 2. ĐỒNG BỘ SEARCH TRÊN URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery(q);
  }, [searchParams]);

  // 3. XỬ LÝ LỌC & TÌM KIẾM
  useEffect(() => {
    let result = allEvents;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortSummary.toLowerCase().includes(q) ||
          e.year.toLowerCase().includes(q) ||
          e.period.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "all") {
      result = result.filter((e) => e.category === activeCategory);
    }

    setFilteredEvents(result);
  }, [searchQuery, activeCategory, allEvents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchParams({});
  };

  if (isLoading) {
    return <div className="text-center py-20 text-gray-500">Đang tải danh sách sự kiện...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#8B1A1A] mb-2" style={{ fontSize: "2rem", fontWeight: 700 }}>
          📖 Sự kiện Lịch sử Việt Nam
        </h1>
        <p className="text-gray-600">
          Tổng hợp các sự kiện lịch sử tiêu biểu qua các thời kỳ
        </p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Tìm kiếm theo tên sự kiện, triều đại, năm...'
              className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#8B1A1A] text-white rounded-xl text-sm hover:bg-[#6B1414] transition-colors"
          >
            Tìm
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {categories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                activeCategory === id
                  ? "bg-[#8B1A1A] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-gray-700 mb-2" style={{ fontWeight: 600 }}>Không tìm thấy kết quả</h3>
          <p className="text-gray-500 text-sm">Thử tìm với từ khóa khác hoặc xóa bộ lọc</p>
          <button
            onClick={() => { clearSearch(); setActiveCategory("all"); }}
            className="mt-4 px-4 py-2 bg-[#8B1A1A] text-white rounded-lg text-sm hover:bg-[#6B1414]"
          >
            Xem tất cả sự kiện
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/su-kien/${event.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#DAA520]/40 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[event.category] || "bg-gray-100 text-gray-700"}`}>
                    {categoryLabels[event.category] || "Chưa phân loại"}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90 text-xs">
                  <Clock size={11} />
                  {event.year}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-[#8B1A1A] transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3 line-clamp-2 leading-relaxed">{event.shortSummary}</p>

                <div className="flex items-center gap-1 text-[#8B1A1A] text-sm font-medium">
                  Xem chi tiết <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}