import type { HistoryEvent } from "../../../services/historyService";
import { EventCard } from "./EventCard";

interface EventGridProps {
  events: HistoryEvent[];
}

export function EventGrid({ events }: EventGridProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
}
