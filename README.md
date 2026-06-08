# codex-portfolio05: AI News Radar

`codex-portfolio04` と同じ「AI ニュースを集めて一覧する」目的を、Next.js で現代的に最短実装したポートフォリオです。

04 は Astro と静的 JSON 更新で、当時の実装を保存する作品でした。05 は Next.js App Router を使い、サーバー側で `articles.json` を読み込み、検索・ソース絞り込み・ページングだけを軽い Client Component に分けています。

![AI News Radar desktop](screenshot/portfolio05-desktop.png)

## Features

- AI 関連 RSS の記事アーカイブを一覧表示
- キーワード検索
- ソース別フィルタ
- 24 件単位のページング
- `scripts/update-news.mjs` による RSS 再取得と重複排除
- デスクトップとモバイルに対応したレスポンシブ UI
- `http://127.0.0.1:4174/index.html` でローカル常時表示できる静的配信

## Screenshots

### Desktop

![Desktop view](screenshot/portfolio05-desktop.png)

### Mobile

![Mobile view](screenshot/portfolio05-mobile.png)

### Mobile Cards

![Mobile card view](screenshot/portfolio05-mobile-cards.png)

## Tech Stack

- Next.js App Router
- React
- TypeScript
- CSS Modules ではなく単一の `globals.css` による短距離スタイリング
- Node.js 標準 `fetch`

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Update RSS Data

```bash
npm run rss
```

RSS ソースは `rss_sources.yml`、出力先は `public/articles.json` です。

## Build

```bash
npm run build
```

## Local Always-On Setup

PC 再起動後も次の URL で表示できるようにするには、Windows のログオン時にローカル配信サーバーを自動起動するタスクを登録します。

```bash
npm run build
npm run startup:register
```

登録後、手動で起動確認する場合:

```bash
npm run serve:local
```

Open:

```text
http://127.0.0.1:4174/index.html
```

このサイトは `out/` に出力された静的ファイルを `scripts/serve-static.mjs` で配信します。PC 再起動時は Windows タスクスケジューラの `Portfolio05LocalNewsSite` がログオン時にローカルサーバーを起動します。

タスクスケジューラ登録が権限不足で失敗した場合は、同じスクリプトがユーザーのスタートアップフォルダに `portfolio05-local-server.cmd` を作成します。この場合も Windows ログオン時に同じ URL が復旧します。

## Difference From portfolio04

| Point | portfolio04 | portfolio05 |
| --- | --- | --- |
| Framework | Astro | Next.js App Router |
| Rendering | 静的 HTML 生成を中心に構成 | Server Component でデータを読み、必要部分だけ Client Component 化 |
| Data Delivery | 画面表示用の静的 JSON が中心 | `public/articles.json` を Server Component で読み、静的 HTML として export |
| UI Behavior | ブラウザ側の軽い JavaScript で検索・フィルタ・ページング | React state で検索・フィルタ・ページングを管理 |
| Deploy Fit | GitHub Pages など静的ホスティングと相性が良い | 静的 export とローカル Node 配信の両方に対応 |
| Maintainability | シンプルで壊れにくい | コンポーネント分離と API 拡張に強い |
| Implementation Size | 静的サイトとして素直 | 現代的な機能を少ないファイルでまとめた構成 |
| Restart Resilience | 静的配信なので復旧しやすい | `out/index.html` と自動起動タスクで `127.0.0.1:4174` を復旧 |

## Which Is Better?

客観的には、用途によって優劣が分かれます。

純粋に「RSS を定期取得して静的なニュース一覧を公開する」だけなら、`portfolio04` の Astro 構成の方が優れています。理由は、静的 HTML と JSON を中心にした構成なので、ホスティングが簡単で、実行時サーバーへの依存が少なく、長期運用時の故障点も少ないためです。

一方で、「将来的に認証、保存、AI 要約、タグ分類、管理画面などへ拡張したい」なら、`portfolio05` の Next.js 構成の方が優れています。Server Component と Client Component を自然に組み合わせられるため、現在の Web アプリ開発の延長で機能追加しやすいからです。

このポートフォリオ上の評価では、`portfolio04` は「静的ニュースサイトとして堅い実装」、`portfolio05` は「同じ目的を現在の Next.js で拡張可能に作り直した実装」です。総合的には、将来の拡張性まで含めると `portfolio05` が優位です。ただし、静的公開の軽さと運用安定性だけを評価するなら `portfolio04` が優位です。

## Relation To portfolio04

`portfolio04` は Astro で静的サイトとして再現した保存版です。`portfolio05` は同じ目的を Next.js で作り直し、Server Component と Client Component を含む、より現在の実装判断を見せる作品です。
