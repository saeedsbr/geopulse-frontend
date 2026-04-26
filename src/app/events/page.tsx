import EventList from "@/components/events/EventList";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "Historical Events - GeoPulse" };

export default async function EventsPage() {
  const events = await serverApi.getEvents();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Historical Events</h1>
      <EventList events={events} />
    </div>
  );
}
