import { notFound } from "next/navigation";
import EventDetail from "@/components/events/EventDetail";
import { serverApi } from "@/lib/serverApi";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  try {
    const event = await serverApi.getEvent(params.id);

    const [linkedConflicts, linkedEvents] = await Promise.all([
      Promise.all(
        event.linkedConflictIds.map((cid) => serverApi.getConflict(String(cid)).catch(() => null))
      ),
      Promise.all(
        event.linkedEventIds.map((eid) => serverApi.getEvent(eid).catch(() => null))
      ),
    ]);

    return (
      <EventDetail
        event={event}
        linkedConflicts={linkedConflicts.filter((c): c is NonNullable<typeof c> => c !== null)}
        linkedEvents={linkedEvents.filter((e): e is NonNullable<typeof e> => e !== null)}
      />
    );
  } catch {
    notFound();
  }
}
