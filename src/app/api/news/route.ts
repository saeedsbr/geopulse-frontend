import { NextResponse } from "next/server";
import { fetchRSSNews } from "@/lib/rssFetcher";
import { newsArticles } from "@/lib/mockData";

export async function GET() {
  try {
    const articles = await fetchRSSNews();

    // If RSS returned nothing, fall back to mock data
    if (articles.length === 0) {
      return NextResponse.json(newsArticles);
    }

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(newsArticles);
  }
}
