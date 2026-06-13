import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router";
import {
  eventCategories,
  getCategoryMeta,
  historyService,
  HistoryEvent,
} from "../../services/historyService";
import { EmptyState } from "../components/common";
import { EventGrid } from "../components/events/EventGrid";
import { EventResultsInfo } from "../components/events/EventResultsInfo";
import { EventSearchFilters } from "../components/events/EventSearchFilters";
import { EventsError } from "../components/events/EventsError";
import { EventsHero } from "../components/events/EventsHero";
import { EventsLoading } from "../components/events/EventsLoading";

export function Events() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
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
        "Không thể tải dữ liệu sự kiện lịch sử. Hãy kiểm tra Spring Boot API đã chạy chưa."
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

  const handleSearch = (e: FormEvent) => {
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
    return <EventsLoading />;
  }

  if (error) {
    return <EventsError error={error} onReload={loadData} />;
  }

  return (
    <main className="min-h-screen bg-[#F8F3EA]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EventsHero
          totalEvents={events.length}
          totalCategories={eventCategories.length - 1}
          visibleEvents={filteredEvents.length}
        />

        <EventSearchFilters
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          categoryCounts={categoryCounts}
          hasFilter={hasFilter}
          onSearchChange={setSearchQuery}
          onSubmitSearch={handleSearch}
          onClearSearch={clearSearch}
          onChangeCategory={handleChangeCategory}
          onClearAllFilters={clearAllFilters}
        />

        <EventResultsInfo
          title={
            activeCategory === "all" ? "Tất cả sự kiện" : selectedCategory.label
          }
          filteredCount={filteredEvents.length}
          totalCount={events.length}
          searchQuery={searchQuery}
        />

        {filteredEvents.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="Không tìm thấy sự kiện phù hợp"
            description="Thử tìm bằng từ khóa khác hoặc xóa bộ lọc hiện tại."
            actionLabel="Xem tất cả sự kiện"
            onAction={clearAllFilters}
          />
        ) : (
          <EventGrid events={filteredEvents} />
        )}
      </div>
    </main>
  );
}
