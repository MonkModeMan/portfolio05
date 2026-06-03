import { NewsDashboard } from "@/components/NewsDashboard";
import { getArticles, getNewsStats } from "@/lib/news";

export default async function Home() {
  const articles = await getArticles();
  const stats = getNewsStats(articles);

  return (
    <main>
      <section className="hero">
        <div className="hero__copy">
          <p className="eyebrow">codex-portfolio05</p>
          <h1>AI News Radar</h1>
          <p className="hero__lead">
            RSS で集めた AI ニュースと論文を、Next.js のサーバー読み込みと軽いクライアント操作で素早く眺めるニュースまとめサイト。
          </p>
        </div>
        <div className="hero__stats" aria-label="ニュース統計">
          <div>
            <strong>{stats.total.toLocaleString("ja-JP")}</strong>
            <span>articles</span>
          </div>
          <div>
            <strong>{stats.sources}</strong>
            <span>sources</span>
          </div>
          <div>
            <strong>{stats.latestLabel}</strong>
            <span>latest</span>
          </div>
        </div>
      </section>

      <NewsDashboard articles={articles} />
    </main>
  );
}
