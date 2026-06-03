import { promises as fs } from "fs";
import path from "path";

export type Article = {
  title: string;
  description?: string;
  summary?: string;
  pubDate: string;
  source?: string;
  media?: string;
  url: string;
  thumbnail?: string;
};

const collator = new Intl.Collator("ja-JP");

export async function getArticles(): Promise<Article[]> {
  const filePath = path.join(process.cwd(), "public", "articles.json");
  const raw = await fs.readFile(filePath, "utf8");
  const articles = JSON.parse(raw) as Article[];

  return articles
    .filter((article) => article.title && article.url)
    .sort((a, b) => {
      const dateDiff = new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      if (dateDiff !== 0) return dateDiff;
      return collator.compare(a.title, b.title);
    });
}

export function getNewsStats(articles: Article[]) {
  const sourceNames = new Set(articles.map((article) => article.source || article.media || "Unknown"));
  const latest = articles[0]?.pubDate;

  return {
    total: articles.length,
    sources: sourceNames.size,
    latestLabel: latest
      ? new Intl.DateTimeFormat("ja-JP", {
          month: "short",
          day: "numeric",
          timeZone: "Asia/Tokyo",
        }).format(new Date(latest))
      : "-",
  };
}
