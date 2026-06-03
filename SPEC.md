# SPEC: AI News Radar

## Goal

AI 関連ニュース、研究ブログ、arXiv 論文フィードを集め、短時間で流し読みできる Next.js 製ニュースまとめサイトを作る。

## Architecture

```text
rss_sources.yml
      |
      v
scripts/update-news.mjs
      |
      v
public/articles.json
      |
      +--> app/page.tsx
      |
      +--> app/api/news/route.ts
```

## Runtime Flow

1. `app/page.tsx` が Server Component として `public/articles.json` を読み込む。
2. 統計値を計算し、ヒーロー部分に記事数、ソース数、最新日付を表示する。
3. `NewsDashboard` に記事配列を渡す。
4. `NewsDashboard` はクライアント側で検索、ソース絞り込み、ページングを行う。
5. `/api/news` は同じ記事配列と統計値を JSON で返す。

## Data Shape

```json
{
  "title": "Article title",
  "description": "RSS description",
  "summary": "Short summary",
  "pubDate": "Wed, 03 Jun 2026 04:00:00 GMT",
  "source": "arXiv AI",
  "url": "https://example.com/article",
  "thumbnail": "/assets/ai-icon.png"
}
```

## Scope

Included:

- RSS 記事一覧
- 検索
- ソースフィルタ
- ページング
- JSON API
- 手動 RSS 更新スクリプト
- レスポンシブ表示

Excluded:

- ログイン
- 管理画面
- データベース
- 本文スクレイピング
- AI 要約 API 連携
- 常時起動ジョブ

## Design Direction

ニュースサイトとして情報密度を優先する。上部に検索とフィルタを固定し、記事を繰り返し眺める用途に寄せる。色はニュートラルな紙色、ティールの操作色、少量のゴールドを使い、04 の素朴なカード一覧から一段だけ現在のプロダクト UI に近づける。

## Technical Difference From portfolio04

`portfolio04` は、RSS 更新後の `articles.json` を Astro が読み込み、静的 HTML として出力する設計だった。記事カードの表示は静的 HTML に寄せ、検索・フィルタ・ページングだけを小さなブラウザスクリプトで制御していた。

`portfolio05` は、Next.js App Router を使い、`app/page.tsx` が Server Component として記事データを読み込む。検索・フィルタ・ページングは `NewsDashboard` に切り出し、React の state で管理する。さらに `/api/news` を追加し、画面表示だけでなく外部利用できる JSON API も持つ。

技術的な相違点は次の通り。

- `portfolio04`: 静的サイト生成に強く、GitHub Pages のような静的配信に向く。
- `portfolio05`: API、Server Component、Client Component を組み合わせられ、アプリ化や機能拡張に向く。
- `portfolio04`: 実行時のサーバー依存が少ないため、運用安定性が高い。
- `portfolio05`: 将来的な AI 要約、タグ分類、保存機能、管理画面などを追加しやすい。
- `portfolio04`: 静的 HTML 中心なので初期表示と配信は軽い。
- `portfolio05`: React と Next.js の構造により、状態管理や API 連携を自然に拡張できる。

## Objective Evaluation

客観的に見ると、静的ニュース一覧としては `portfolio04` が優れている。理由は、静的 HTML と JSON の組み合わせが軽く、公開環境の選択肢が広く、実行時サーバーを必要としないためである。

一方で、現代的な Web アプリ作品としては `portfolio05` が優れている。理由は、Next.js App Router、Server Component、Client Component、API Route を使っており、ニュースサイトを API や将来機能へ発展させやすいからである。

したがって結論は次の通り。

- 静的配信、軽さ、長期安定性を重視するなら `portfolio04` が優位。
- 拡張性、API 化、現在の Next.js 実装力の提示を重視するなら `portfolio05` が優位。
- ポートフォリオとして「今ならどう作るか」を見せる目的では `portfolio05` が総合的に優位。

## Verification

確認するコマンド:

```bash
npm run build
```

必要に応じて:

```bash
npm run rss
```
