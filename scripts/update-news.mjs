import { promises as fs } from "fs";
import path from "path";

const root = process.cwd();
const sourcesFile = path.join(root, "rss_sources.yml");
const articlesFile = path.join(root, "public", "articles.json");
const fallbackThumbnail = "/assets/ai-icon.png";

function decodeEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

function parseSources(yaml) {
  const entries = [];
  let current = null;

  for (const line of yaml.split(/\r?\n/)) {
    const name = line.match(/^\s*-\s+name:\s*(.+)$/);
    if (name) {
      if (current) entries.push(current);
      current = { name: name[1].trim() };
      continue;
    }

    const url = line.match(/^\s+url:\s*(.+)$/);
    if (url && current) current.url = url[1].trim();
  }

  if (current) entries.push(current);
  return entries.filter((entry) => entry.name && entry.url);
}

function parseFeed(xml, sourceName) {
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  return itemBlocks.map((block) => {
    const linkTag = getTag(block, "link");
    const linkHref = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1];
    const url = linkHref || linkTag;
    const pubDate = getTag(block, "pubDate") || getTag(block, "updated") || getTag(block, "published") || new Date().toUTCString();
    const summary = getTag(block, "description") || getTag(block, "summary") || getTag(block, "content");

    return {
      title: getTag(block, "title"),
      description: summary,
      summary,
      pubDate,
      source: sourceName,
      url,
      thumbnail: sourceName.toLowerCase().includes("arxiv") ? "/assets/arxiv.png" : fallbackThumbnail,
    };
  }).filter((article) => article.title && article.url);
}

async function main() {
  const [sourceYaml, currentRaw] = await Promise.all([
    fs.readFile(sourcesFile, "utf8"),
    fs.readFile(articlesFile, "utf8").catch(() => "[]"),
  ]);
  const sources = parseSources(sourceYaml);
  const current = JSON.parse(currentRaw);
  const nextArticles = [];

  for (const source of sources) {
    try {
      const response = await fetch(source.url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      nextArticles.push(...parseFeed(await response.text(), source.name));
    } catch (error) {
      console.warn(`Skipped ${source.name}: ${error.message}`);
    }
  }

  const byUrl = new Map();
  for (const article of [...nextArticles, ...current]) {
    if (!article.url || byUrl.has(article.url)) continue;
    byUrl.set(article.url, article);
  }

  const merged = Array.from(byUrl.values()).sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  await fs.writeFile(articlesFile, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  console.log(`articles.json: ${current.length} -> ${merged.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
