import { notFound } from "next/navigation";
import ConflictDetail from "@/components/conflicts/ConflictDetail";
import { serverApi } from "@/lib/serverApi";

export default async function ConflictDetailPage({ params }: { params: { id: string } }) {
  try {
    const [conflict, events, stats, linkedEvents, allNews, allConflicts] = await Promise.all([
      serverApi.getConflict(params.id),
      serverApi.getConflictEvents(params.id),
      serverApi.getConflictStats(params.id),
      serverApi.getEventsByConflict(Number(params.id)),
      serverApi.getNews(),
      serverApi.getConflicts(),
    ]);

    const conflictNews = allNews.filter(
      (n) => n.conflictId === Number(params.id),
    );

    // Find related conflicts (share participants with current conflict)
    const currentIsos = new Set(conflict.participants.map((p) => p.isoCode));
    const relatedConflicts = allConflicts.filter(
      (c) =>
        c.id !== conflict.id &&
        c.participants.some((p) => currentIsos.has(p.isoCode)),
    );

    return (
      <ConflictDetail
        conflict={conflict}
        events={events}
        stats={stats}
        linkedEvents={linkedEvents}
        relatedNews={conflictNews}
        relatedConflicts={relatedConflicts}
      />
    );
  } catch {
    notFound();
  }
}
