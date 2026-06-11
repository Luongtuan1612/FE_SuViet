import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Filter,
  RefreshCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  eventCategories,
  getCategoryMeta,
  historyService,
  HistoryEvent,
} from "../../services/historyService";

const DEFAULT_IMAGE = "https://placehold.co/800x450/png?text=Su+Viet";

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const articlesData = await historyService.getAllArticles();
      setEvents(articlesData);
    } catch (err) {
      console.error("Lỗi tải dữ liệu sự kiện:", err);
      setError(
        "Không thể tải dữ liệu sự kiện lịch sử. Hãy kiểm tra Spring Boot API đã chạy chưa.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  const updateUrlParams = (next?: { q?: string; category?: string }) => {
    const q = next?.q ?? searchQuery;
    const category = next?.category ?? activeCategory;

    const params: Record<string, string> = {};

    if (q.trim()) params.q = q.trim();
    if (category !== "all") params.category = category;

    setSearchParams(params);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: events.length,
    };

    events.forEach((event) => {
      counts[event.category] = (counts[event.category] || 0) + 1;
    });

    return counts;
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = events;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();

      result = result.filter((event) => {
        const category = getCategoryMeta(event.category);

        return (
          event.title.toLowerCase().includes(q) ||
          event.shortSummary.toLowerCase().includes(q) ||
          event.content.toLowerCase().includes(q) ||
          event.year.toLowerCase().includes(q) ||
          event.period.toLowerCase().includes(q) ||
          category.label.toLowerCase().includes(q) ||
          event.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          event.figures.some((figure) => figure.name.toLowerCase().includes(q))
        );
      });
    }

    if (activeCategory !== "all") {
      result = result.filter((event) => event.category === activeCategory);
    }

    return result;
  }, [events, searchQuery, activeCategory]);

  const selectedCategory = getCategoryMeta(activeCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrlParams({ q: searchQuery });
  };

  const handleChangeCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    updateUrlParams({ category: categoryId });
  };

  const clearSearch = () => {
    setSearchQuery("");
    updateUrlParams({ q: "" });
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setActiveCategory("all");
    setSearchParams({});
  };

  const hasFilter = Boolean(searchQuery.trim()) || activeCategory !== "all";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F3EA]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 rounded-[28px] bg-white border border-[#eadfce] shadow-sm p-6">
            <div className="h-7 w-72 bg-gray-200 rounded-lg animate-pulse mb-3" />
            <div className="h-4 w-96 max-w-full bg-gray-100 rounded-lg animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-[24px] overflow-hidden border border-[#eadfce] shadow-sm animate-pulse"
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-5">
                  <div className="h-5 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-100 rounded mb-2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F3EA]">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white border border-red-100 rounded-[28px] p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">
              ⚠️
            </div>
            <h2 className="text-red-700 font-bold text-xl mb-2">
              Không tải được dữ liệu
            </h2>
            <p className="text-red-600 text-sm mb-6">{error}</p>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#8B1A1A] text-white rounded-xl text-sm font-semibold hover:bg-[#6B1414] transition-colors"
            >
              <RefreshCcw size={16} />
              Tải lại dữ liệu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F3EA]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#8B1A1A] via-[#9d2424] to-[#5d1111] text-white shadow-lg mb-7">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#DAA520]/30 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/12 border border-white/20 text-sm mb-5">
              <Sparkles size={15} />
              Dữ liệu lấy trực tiếp từ cơ sở dữ liệu SuViet
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7 items-end">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  Sự kiện Lịch sử Việt Nam
                </h1>
                <p className="text-white/82 leading-relaxed max-w-3xl">
                  Khám phá các sự kiện lịch sử theo nhóm chủ đề như khởi nghĩa,
                  chiến tranh, triều đại, văn hóa, cách mạng và thời kỳ hiện
                  đại.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{events.length}</div>
                  <div className="text-xs text-white/75 mt-1">Sự kiện</div>
                </div>
                <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {eventCategories.length - 1}
                  </div>
                  <div className="text-xs text-white/75 mt-1">Nhóm</div>
                </div>
                <div className="rounded-2xl bg-white/12 border border-white/15 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">
                    {filteredEvents.length}
                  </div>
                  <div className="text-xs text-white/75 mt-1">Đang hiện</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search and category */}
        <section className="bg-white/95 backdrop-blur rounded-[28px] border border-[#eadfce] shadow-sm p-4 md:p-5 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên sự kiện, nhân vật, năm, nội dung..."
                className="w-full pl-11 pr-11 py-3 border border-[#eadfce] rounded-2xl text-sm bg-[#FFFCF7] focus:outline-none focus:ring-4 focus:ring-[#8B1A1A]/10 focus:border-[#8B1A1A]/40 transition-all"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B1A1A] transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#8B1A1A] text-white rounded-2xl text-sm font-semibold hover:bg-[#6B1414] active:scale-[0.99] transition-all shadow-sm"
            >
              Tìm
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-[#f0e6d7]">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <span className="h-8 w-8 rounded-xl bg-[#F5EDD8] text-[#8B4513] flex items-center justify-center">
                  <Filter size={15} />
                </span>
                Phân loại sự kiện
              </div>

              {hasFilter && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-[#8B1A1A] hover:underline flex items-center gap-1"
                >
                  <X size={13} />
                  Xóa lọc
                </button>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              {eventCategories.map((category) => {
                const isActive = activeCategory === category.id;
                const count = categoryCounts[category.id] || 0;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChangeCategory(category.id)}
                    className={`group shrink-0 rounded-2xl border px-3.5 py-2.5 text-left transition-all ${
                      isActive
                        ? "border-[#8B1A1A] bg-[#8B1A1A] text-white shadow-md shadow-[#8B1A1A]/20"
                        : "border-[#eadfce] bg-[#FFFCF7] text-gray-700 hover:border-[#DAA520]/70 hover:bg-[#FFF7E6]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isActive ? "bg-[#DAA520]" : "bg-[#DAA520]/70"
                        }`}
                      />
                      <span className="text-sm font-semibold whitespace-nowrap">
                        {category.label}
                      </span>
                    </div>

                    <div
                      className={`mt-1 text-xs ${
                        isActive ? "text-white/75" : "text-gray-400"
                      }`}
                    >
                      {count} sự kiện
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Result summary */}
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory === "all"
                ? "Tất cả sự kiện"
                : selectedCategory.label}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Hiển thị{" "}
              <strong className="text-[#8B1A1A]">
                {filteredEvents.length}
              </strong>{" "}
              trên tổng số <strong>{events.length}</strong> sự kiện
              {searchQuery && (
                <>
                  {" "}
                  cho từ khóa{" "}
                  <strong className="text-[#8B1A1A]">"{searchQuery}"</strong>
                </>
              )}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-sm text-[#8B4513] bg-[#FFF7E6] border border-[#eadfce] px-3 py-2 rounded-2xl w-fit">
            <BookOpen size={15} />
            Nhấn vào thẻ để xem chi tiết
          </div>
        </section>

        {/* Empty */}
        {filteredEvents.length === 0 ? (
          <section className="bg-white rounded-[28px] border border-[#eadfce] p-10 text-center shadow-sm">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#F5EDD8] flex items-center justify-center text-3xl mb-4">
              🔍
            </div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              Không tìm thấy sự kiện phù hợp
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              Thử tìm bằng từ khóa khác hoặc xóa bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-[#8B1A1A] text-white rounded-2xl text-sm font-semibold hover:bg-[#6B1414] transition-colors"
            >
              Xem tất cả sự kiện
            </button>
          </section>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const category = getCategoryMeta(event.category);

              return (
                <Link
                  key={event.id}
                  to={`/su-kien/${event.id}`}
                  className="group h-full bg-white rounded-[26px] overflow-hidden border border-[#eadfce] hover:border-[#DAA520] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-[#F5EDD8]">
                    <img
                      src={event.image || DEFAULT_IMAGE}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_IMAGE;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${category.color}`}
                      >
                        {category.label}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="inline-flex items-center gap-1.5 text-white/90 text-xs bg-black/25 backdrop-blur-sm rounded-full px-2.5 py-1 mb-2">
                        <Clock size={12} />
                        {event.year}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Tiêu đề */}
                    <h3 className="text-gray-900 font-bold text-lg leading-snug line-clamp-2 mb-3 group-hover:text-[#8B1A1A] transition-colors">
                      {event.title}
                    </h3>

                    {/* Tóm tắt */}
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                      {event.shortSummary}
                    </p>

                    {/* Nhân vật liên quan */}
                    {event.figures.length > 0 && (
                      <div className="mb-5">
                        <div className="text-xs font-semibold text-gray-500 mb-2">
                          Nhân vật liên quan
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {event.figures.slice(0, 3).map((figure) => (
                            <span
                              key={figure.id}
                              className="px-2.5 py-1 bg-[#FFF7E6] text-[#8B4513] border border-[#eadfce] text-xs rounded-full"
                            >
                              {figure.name}
                            </span>
                          ))}

                          {event.figures.length > 3 && (
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-100 text-xs rounded-full">
                              +{event.figures.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Nút xem chi tiết */}
                    <div className="mt-auto pt-4 border-t border-[#f0e6d7]">
                      <div className="flex items-center justify-end">
                        <span className="inline-flex items-center gap-1.5 text-[#8B1A1A] text-sm font-bold group-hover:text-[#6B1414] transition-colors">
                          Xem chi tiết
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-1 transition-transform"
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
