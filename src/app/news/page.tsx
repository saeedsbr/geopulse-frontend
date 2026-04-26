import NewsFeed from "@/components/news/NewsFeed";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "News - GeoPulse" };

export default async function NewsPage() {
  const articles = await serverApi.getNews();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Intelligence Feed</h1>
      <NewsFeed articles={articles} />
    </div>
  );
}
