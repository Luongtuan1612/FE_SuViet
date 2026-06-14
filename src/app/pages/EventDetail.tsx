import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  historyService,
  HistoryEvent,
} from "../../services/historyService";
import { BackButton } from "../components/common";
import { EventContent } from "../components/events/EventContent";
import { EventDetailError } from "../components/events/EventDetailError";
import { EventDetailHero } from "../components/events/EventDetailHero";
import { EventDetailLoading } from "../components/events/EventDetailLoading";
import { EventDetailSidebar } from "../components/events/EventDetailSidebar";
import { EventSummaryBox } from "../components/events/EventSummaryBox";

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
    return <EventDetailLoading />;
  }

  if (error || !event) {
    return (
      <EventDetailError
        error={error || "Sự kiện này không tồn tại trong cơ sở dữ liệu."}
        onReload={loadEventDetail}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BackButton to="/su-kien" label="Quay lại sự kiện" className="mb-6" />
          <EventDetailHero event={event} />
          <EventSummaryBox summary={event.shortSummary} />
          <EventContent content={event.content} />
        </div>

        <EventDetailSidebar event={event} relatedEvents={relatedEvents} />
      </div>
    </div>
  );
}
