import NewsFeed from "@/components/news/NewsFeed";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "News - GeoPulse" };
export const revalidate = 1800; // Re-fetch news every 30 minutes

export default async function NewsPage() {
  const articles = await serverApi.getNews();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Intelligence Feed</h1>
      <p className="text-sm text-[var(--muted)] mb-6">Latest geopolitical coverage from major news agencies. Click any article to read the full report.</p>
      <NewsFeed articles={articles} />
    </div>
  );
}
