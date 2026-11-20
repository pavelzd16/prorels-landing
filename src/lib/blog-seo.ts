import type { Metadata } from 'next';
import { type Article, getPublishedArticles } from '@/content/articles';
import { identity, site, structuredData } from './site';

export const blogTitle = 'Блог о закупке и поставке материалов ВСП — ПроРельс';
export const blogDescription = 'Практические материалы о закупке рельсов, шпал и крепежа: составление заявки, сравнение предложений поставщиков и согласование доставки.';

export function blogMetadata(article?: Article): Metadata {
  const path = article ? `/blog/${article.slug}` : '/blog';
  const title = article?.seoTitle ?? (article ? `${article.title} — ${site.name}` : blogTitle);
  const description = article?.description ?? blogDescription;
  const image = { url: `${path}/opengraph-image`, width: 1200, height: 630, alt: article?.title ?? 'Блог ПроРельс — полезные материалы для закупки ВСП' };
  return {
    title,
    description,
    ...(identity.origin ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title, description, siteName: site.name, locale: 'ru_RU', images: [image],
      ...(identity.origin ? { url: `${identity.origin}${path}` } : {}),
      ...(article ? { type: 'article', publishedTime: article.publishedAt, modifiedTime: article.updatedAt, section: article.category } : { type: 'website' }),
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export function blogStructuredData(article?: Article) {
  const base = structuredData();
  const origin = identity.origin;
  if (!origin) return base;
  const path = article ? `/blog/${article.slug}` : '/blog';
  const url = `${origin}${path}`;
  const organization = { '@id': `${site.catalogOrigin}/#organization` };
  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumbs`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: `${origin}/` },
      { '@type': 'ListItem', position: 2, name: 'Блог', item: `${origin}/blog` },
      ...(article ? [{ '@type': 'ListItem', position: 3, name: article.title, item: url }] : []),
    ],
  };
  const page = {
    '@type': article ? 'WebPage' : 'CollectionPage',
    '@id': `${url}#webpage`, url,
    name: article?.title ?? blogTitle,
    description: article?.description ?? blogDescription,
    inLanguage: 'ru-RU',
    isPartOf: { '@id': `${origin}/#website` },
    breadcrumb: { '@id': breadcrumbs['@id'] },
    mainEntity: { '@id': `${url}#${article ? 'article' : 'articles'}` },
  };
  const content = article ? {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    url, headline: article.title, description: article.description,
    inLanguage: 'ru-RU', articleSection: article.category,
    datePublished: article.publishedAt, dateModified: article.updatedAt,
    author: { '@type': 'Organization', ...organization, name: site.name, url: `${site.catalogOrigin}/about` },
    publisher: organization,
    ...(article.sources ? { citation: article.sources.map(source => ({ '@type': 'CreativeWork', name: source.title, url: source.url })) } : {}),
    mainEntityOfPage: { '@id': `${url}#webpage` },
    image: { '@type': 'ImageObject', url: `${url}/opengraph-image`, width: 1200, height: 630 },
  } : {
    '@type': 'ItemList',
    '@id': `${url}#articles`,
    itemListElement: getPublishedArticles().map((item, index) => ({
      '@type': 'ListItem', position: index + 1, name: item.title, url: `${origin}/blog/${item.slug}`,
    })),
  };
  return { ...base, '@graph': [...base['@graph'], breadcrumbs, page, content] };
}
