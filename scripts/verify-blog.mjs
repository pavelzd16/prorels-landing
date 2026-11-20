import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { getPublishedArticles } from '../src/content/articles.ts';

const base = process.env.VERIFY_URL || 'http://127.0.0.1:4193';
const expectedOrigin = process.env.VERIFY_SITE_ORIGIN;
const expectedIndexable = process.env.VERIFY_INDEXABLE === 'true';
const get = path => fetch(new URL(path, base), { redirect: 'manual' });
const html = await (await get('/')).text();
const sitemapXml = await (await get('/sitemap.xml')).text();
const articles = getPublishedArticles();
const indexResponse = await get('/blog');
assert.equal(indexResponse.status, 200);
const indexHtml = await indexResponse.text();
const articleImageHashes = new Set();
const pageTitles = new Set();
for (const article of articles) {
  const href = `href="/blog/${article.slug}"`;
  if (articles.indexOf(article) < 3) assert.ok(html.includes(href), 'homepage links to the three featured articles');
  assert.ok(indexHtml.includes(href), 'blog index links to published articles');
}

for (const article of [undefined, ...articles]) {
  const path = article ? `/blog/${article.slug}` : '/blog';
  const pageResponse = await get(path);
  assert.equal(pageResponse.status, 200, path);
  const page = await pageResponse.text();
  const pageMeta = (name, attr = 'name') => page.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`))?.[1];
  const title = page.match(/<title>(.*?)<\/title>/)?.[1];
  if (article?.seoTitle) assert.equal(title, article.seoTitle, path);
  else assert.ok(title?.includes('ПроРельс'), path);
  assert.ok(!pageTitles.has(title), 'unique page titles');
  pageTitles.add(title);
  assert.equal((page.match(/<h1[\s>]/g) || []).length, 1, path);
  assert.match(page, /<html[^>]*lang="ru"/);
  assert.ok(page.includes('href="/#contacts"'), 'navigation works from nested pages');
  assert.equal(pageMeta('twitter:title'), title);
  assert.equal(pageMeta('og:type', 'property'), article ? 'article' : 'website');
  const pageCanonical = page.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  const graph = JSON.parse(page.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || '{}')['@graph'];
  if (expectedOrigin) {
    assert.equal(pageCanonical, `${expectedOrigin}${path}`, 'self canonical');
    assert.equal(pageMeta('og:url', 'property'), `${expectedOrigin}${path}`);
    const breadcrumbs = graph.find(item => item['@type'] === 'BreadcrumbList');
    assert.equal(breadcrumbs.itemListElement.at(-1).item, `${expectedOrigin}${path}`);
    const item = graph.find(item => item['@type'] === (article ? 'BlogPosting' : 'ItemList'));
    if (article) {
      assert.equal(item.headline, article.title);
      assert.equal(item.datePublished, article.publishedAt);
      assert.equal(item.dateModified, article.updatedAt);
      assert.equal(item.author.name, 'ПроРельс');
      assert.equal(item.mainEntityOfPage['@id'], `${expectedOrigin}${path}#webpage`);
    } else assert.equal(item.itemListElement.length, articles.length);
  } else {
    assert.equal(pageCanonical, undefined);
    assert.equal(pageMeta('og:url', 'property'), undefined);
  }
  if (expectedIndexable) {
    assert.equal(pageMeta('robots'), 'index, follow');
    assert.equal(pageResponse.headers.get('x-robots-tag'), null);
    assert.ok(sitemapXml.includes(`<loc>${expectedOrigin}${path}</loc>`));
    if (article) assert.ok(sitemapXml.includes(`<lastmod>${article.updatedAt}</lastmod>`));
    assert.ok(!page.includes('http://127.0.0.1:4193'));
  } else {
    assert.match(pageMeta('robots'), /noindex/);
    assert.match(pageResponse.headers.get('x-robots-tag'), /noindex/);
  }
  if (article) {
    const catalogPath = article.catalogCategory ? `/catalog/${article.catalogCategory}` : '/catalog';
    const catalogLink = page.match(/<div class="article-cta-actions">\s*<a[^>]*href="([^"]+)"/)?.[1];
    assert.equal(catalogLink, `https://prorelsa.ru${catalogPath}`, 'article CTA opens its catalog destination directly');
    assert.equal(pageMeta('description'), article.description);
    assert.ok(page.includes(article.intro), 'article body is in server HTML');
    assert.ok(page.includes(`dateTime="${article.publishedAt}"`));
    for (const section of article.sections) {
      assert.ok(page.includes(`href="#${section.id}"`) && page.includes(`id="${section.id}"`), 'every contents link resolves');
      assert.ok(page.includes(section.paragraphs[0]), 'complete section is in HTML');
    }
    assert.ok(page.includes('href="mailto:zakaz@prorelsa.ru"'));
    assert.ok(page.includes('aria-label="Заявка на поставку"'), 'article has a contact form');
    for (const field of ['email', 'phone', 'comment']) assert.ok(page.includes(`name="${field}"`));
    if (article.sources) for (const source of article.sources) assert.ok(page.includes(`href="${source.url}"`));
    for (const related of articles.filter(item => item.slug !== article.slug).slice(0, 2)) assert.ok(page.includes(`href="/blog/${related.slug}"`));
  }
  const imageUrl = new URL(pageMeta('og:image', 'property'));
  assert.equal(imageUrl.pathname, `${path}/opengraph-image`, 'article-specific social image');
  assert.equal(pageMeta('twitter:image'), imageUrl.href);
  const image = await get(imageUrl.pathname);
  assert.equal(image.status, 200);
  assert.match(image.headers.get('content-type'), /image\/png/);
  const data = Buffer.from(await image.arrayBuffer());
  assert.equal(data.readUInt32BE(16), 1200);
  assert.equal(data.readUInt32BE(20), 630);
  articleImageHashes.add(createHash('sha256').update(data).digest('hex'));
}
assert.equal(articleImageHashes.size, articles.length + 1, 'every blog social image is distinct');
if (expectedIndexable) assert.equal((sitemapXml.match(/<loc>/g) || []).length, articles.length + 2, 'only public HTML pages in sitemap');
for (const path of ['/blog/unknown-article', '/blog/unknown-article/opengraph-image']) {
  const missingArticle = await get(path);
  assert.equal(missingArticle.status, 404, path);
  const missingBody = await missingArticle.text();
  assert.ok(!/<link[^>]*rel="canonical"/.test(missingBody));
  assert.ok(!missingBody.includes('"@type":"BlogPosting"'));
  assert.ok(missingBody.includes('noindex') || missingArticle.headers.get('x-robots-tag')?.includes('noindex'));
}
console.log(`Blog SEO verified: index, ${articles.length} static articles, unique metadata/social images, contents links, Article/Breadcrumb JSON-LD, ${expectedIndexable ? 'production indexability' : 'preview noindex'}, sitemap and real 404s.`);
