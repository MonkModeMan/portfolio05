"use client";

import { useMemo, useState } from "react";
import type { Article } from "@/lib/news";

const PAGE_SIZE = 24;

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

function excerpt(article: Article) {
  const text = article.summary || article.description || "";
  return text.replace(/^arXiv:[^A]+Abstract:\s*/i, "").slice(0, 240);
}

export function NewsDashboard({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("all");
  const [page, setPage] = useState(1);

  const sources = useMemo(() => {
    return Array.from(new Set(articles.map((article) => article.source || article.media || "Unknown"))).sort();
  }, [articles]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return articles.filter((article) => {
      const articleSource = article.source || article.media || "Unknown";
      const haystack = normalize(`${article.title} ${article.description || ""} ${article.summary || ""} ${articleSource}`);
      const matchesQuery = !q || haystack.includes(q);
      const matchesSource = source === "all" || articleSource === source;
      return matchesQuery && matchesSource;
    });
  }, [articles, query, source]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleArticles = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  function updateSource(value: string) {
    setSource(value);
    setPage(1);
  }

  return (
    <section className="dashboard" aria-label="AI news dashboard">
      <div className="toolbar">
        <label className="search">
          <span>Search</span>
          <input
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="LLM, OpenAI, robot, arXiv..."
            type="search"
          />
        </label>

        <label className="select">
          <span>Source</span>
          <select value={source} onChange={(event) => updateSource(event.target.value)}>
            <option value="all">All sources</option>
            {sources.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <div className="result-count" aria-live="polite">
          {filtered.length.toLocaleString("ja-JP")} results
        </div>
      </div>

      {visibleArticles.length > 0 ? (
        <div className="article-grid">
          {visibleArticles.map((article) => {
            const sourceName = article.source || article.media || "Unknown";

            return (
              <article className="article-card" key={article.url}>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={article.thumbnail || "/assets/ai-icon.png"}
                    alt=""
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src = "/assets/ai-icon.png";
                    }}
                  />
                  <div className="article-card__body">
                    <div className="article-card__meta">
                      <span>{sourceName}</span>
                      <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
                    </div>
                    <h2>{article.title}</h2>
                    <p>{excerpt(article)}</p>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">条件に一致する記事がありません。</div>
      )}

      <nav className="pager" aria-label="Pagination">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage <= 1}>
          Prev
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
