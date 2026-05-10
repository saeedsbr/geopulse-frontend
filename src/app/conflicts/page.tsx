import ConflictList from "@/components/conflicts/ConflictList";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "Active Conflicts - GeoPulse" };

export default async function ConflictsPage() {
  const conflicts = await serverApi.getConflicts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-6">Global Conflicts</h1>
      <ConflictList conflicts={conflicts} />
    </div>
  );
}
