import type { HistoryEvent } from "../../../services/historyService";
import { EventFigureBox } from "./EventFigureBox";
import { EventQuickActions } from "./EventQuickActions";
import { EventTagBox } from "./EventTagBox";
import { EventTimelineInfo } from "./EventTimelineInfo";
import { RelatedEvents } from "./RelatedEvents";

interface EventDetailSidebarProps {
  event: HistoryEvent;
  relatedEvents: HistoryEvent[];
}

export function EventDetailSidebar({
  event,
  relatedEvents,
}: EventDetailSidebarProps) {
  const figures = event.figures || [];
  const tags = event.tags || [];

  return (
    <div className="space-y-5">
      <EventTagBox tags={tags} />
      <EventFigureBox figures={figures} />
      <EventTimelineInfo event={event} />
      <RelatedEvents relatedEvents={relatedEvents} />
      <EventQuickActions />
    </div>
  );
}
