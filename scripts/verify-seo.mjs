import assert from "node:assert/strict";

// Run against the built server. VERIFY_SITE_ORIGIN is an expected value, never sent to it.
const base = process.env.VERIFY_URL || "http://127.0.0.1:4193";
const expectedOrigin = process.env.VERIFY_SITE_ORIGIN;
const expectedIndexable = process.env.VERIFY_INDEXABLE === "true";
const get = (path) => fetch(new URL(path, base), { redirect: "manual" });
const response = await get("/");
assert.equal(response.status, 200);
const html = await response.text();
const tag = (name, attr = "name") =>
  html.match(
    new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`),
  )?.[1];
assert.equal(
  (html.match(/<h1[\s>]/g) || []).length,
  1,
  "exactly one H1 in server HTML",
);
assert.match(html, /<html[^>]*lang="ru"/);
assert.match(html, /<title>Рельсы, шпалы и крепёж.*ПроРельс<\/title>/);
assert.ok(tag("description")?.includes("верхнего строения пути"));
assert.equal(tag("og:locale", "property"), "ru_RU");
assert.equal(tag("twitter:card"), "summary_large_image");
assert.ok(
  html.includes("Зеленодольск") && html.includes("Собственный склад"),
  "content is rendered without JS",
);
for (const slug of [
  "zheleznodorozhnye-relsy",
  "zhd-shpaly",
  "zhd-krepezh",
  "kranovye-relsy",
  "relsovoe-skreplenie-zhbr-ars",
  "stykovye-zhd-nakladki",
]) {
  assert.ok(
    html.includes(`href="https://prorelsa.ru/catalog/${slug}"`),
    `external category: ${slug}`,
  );
}
const schema = JSON.parse(
  html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  )?.[1] || "{}",
);
assert.equal(schema["@graph"][0].name, "ПроРельс");
assert.equal(schema["@graph"][0].legalName, "ООО «ИНВИА»");
assert.equal(schema["@graph"][0].email, "zakaz@prorelsa.ru");
const canonical = html.match(
  /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/,
)?.[1];
const sitemap = await get("/sitemap.xml");
assert.equal(sitemap.status, 200);
const sitemapXml = await sitemap.text();
const robots = await get("/robots.txt");
assert.equal(robots.status, 200);
const robotsText = await robots.text();
assert.match(robotsText, /Allow: \//);
if (expectedOrigin) {
  assert.equal(new URL(canonical).href, `${expectedOrigin}/`);
  assert.equal(new URL(tag("og:url", "property")).href, `${expectedOrigin}/`);
  assert.equal(schema["@graph"][1].url, `${expectedOrigin}/`);
} else {
  assert.equal(canonical, undefined);
}
if (expectedIndexable) {
  assert.equal(tag("robots"), "index, follow");
  assert.equal(response.headers.get("x-robots-tag"), null);
  assert.ok(sitemapXml.includes(`<loc>${expectedOrigin}/</loc>`));
  assert.ok(robotsText.includes(`Sitemap: ${expectedOrigin}/sitemap.xml`));
  assert.ok(!html.includes("http://127.0.0.1:4193"));
} else {
  assert.match(tag("robots") || "", /noindex/);
  assert.match(response.headers.get("x-robots-tag") || "", /noindex/);
  assert.ok(!sitemapXml.includes("<loc>"));
  assert.ok(!robotsText.includes("Sitemap:"));
}
const ogUrl = tag("og:image", "property");
assert.ok(ogUrl, "OG image exists in the rendered metadata");
const og = await get(new URL(ogUrl).pathname + new URL(ogUrl).search);
assert.equal(og.status, 200);
assert.match(og.headers.get("content-type") || "", /image\/png/);
const png = Buffer.from(await og.arrayBuffer());
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
const missing = await get("/this-page-does-not-exist");
assert.equal(missing.status, 404);
const missingHtml = await missing.text();
assert.ok(missingHtml.includes("noindex"));
assert.ok(
  !/<link[^>]*rel="canonical"/.test(missingHtml),
  "404 must not canonicalize to the homepage",
);
assert.equal((await get("/icon.svg")).status, 200);
await import('./verify-blog.mjs');
console.log(
  `SEO verified: SSR, metadata, ${expectedIndexable ? "production indexability" : "preview noindex"}, canonical policy, JSON-LD, six catalog categories, robots, sitemap, PNG 1200×630, real 404.`,
);
