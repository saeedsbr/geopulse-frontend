import { notFound } from "next/navigation";
import ConflictDetail from "@/components/conflicts/ConflictDetail";
import { serverApi } from "@/lib/serverApi";

export default async function ConflictDetailPage({ params }: { params: { id: string } }) {
  try {
    const [conflict, events, stats, linkedEvents] = await Promise.all([
      serverApi.getConflict(params.id),
      serverApi.getConflictEvents(params.id),
      serverApi.getConflictStats(params.id),
      serverApi.getEventsByConflict(Number(params.id)),
    ]);

    return <ConflictDetail conflict={conflict} events={events} stats={stats} linkedEvents={linkedEvents} />;
  } catch {
    notFound();
  }
}
