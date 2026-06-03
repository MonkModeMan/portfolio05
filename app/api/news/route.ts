import { NextResponse } from "next/server";
import { getArticles, getNewsStats } from "@/lib/news";

export async function GET() {
  const articles = await getArticles();

  return NextResponse.json(
    {
      stats: getNewsStats(articles),
      articles,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      },
    }
  );
}
