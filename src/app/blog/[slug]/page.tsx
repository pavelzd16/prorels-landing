import { notFound } from 'next/navigation';
import { ArticleCallout, BlogSection, Breadcrumbs } from '@/components/blog';
import { Icon } from '@/components/icons';
import { formatArticleDate, getArticle, getPublishedArticles, readingMinutes } from '@/content/articles';
import { blogMetadata, blogStructuredData } from '@/lib/blog-seo';
import { site } from '@/lib/site';
import { Kb65Diagram } from '@/components/kb65-diagram';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getPublishedArticles().map(article => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  return blogMetadata(article);
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const related = getPublishedArticles().filter(item => item.slug !== article.slug).slice(0, 2);

  return <main id="main">
    <article>
      <header className="article-hero">
        <div className="container">
          <Breadcrumbs title={article.title} />
          <div className="article-hero-copy">
            <div className="article-meta"><span className="article-category">{article.category}</span><span><Icon name="clock" />{readingMinutes(article)} мин чтения</span><time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time></div>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <div className="article-byline">Материал <a href={`${site.catalogOrigin}/about`}>ПроРельс</a>{article.updatedAt !== article.publishedAt && <span> · Обновлено <time dateTime={article.updatedAt}>{formatArticleDate(article.updatedAt)}</time></span>}</div>
          </div>
        </div>
      </header>
      <div className="container article-layout">
        <aside className="article-sidebar">
          <nav className="article-toc" aria-labelledby="toc-title">
            <h2 id="toc-title"><Icon name="book" />В этой статье</h2>
            <ol>{article.sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}<li><a href="#takeaway">Коротко о главном</a></li></ol>
          </nav>
        </aside>
        <div className="article-body">
          <p className="article-lead">{article.intro}</p>
          {article.sections.map(section => <section className="article-content-section" key={section.id} id={section.id} aria-labelledby={`heading-${section.id}`}>
            <h2 id={`heading-${section.id}`}>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.diagram === 'kb65' && <Kb65Diagram />}
            {section.list && <ul>{section.list.map(item => <li key={item}>{item}</li>)}</ul>}
            {section.table && <div className="article-table-scroll" role="region" aria-label={`Таблица: ${section.title}`} tabIndex={0}><table><caption>{section.title}</caption><thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th key={index} scope="row">{cell}</th> : <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>}
            {section.template && <pre className="article-template">{section.template}</pre>}
            {section.note && <aside className="article-note"><Icon name="document" /><p>{section.note}</p></aside>}
          </section>)}
          <section id="takeaway" className="article-takeaway" aria-labelledby="takeaway-title"><div className="eyebrow">ПЕРЕД ЗАКАЗОМ</div><h2 id="takeaway-title">Коротко о главном</h2><p>{article.takeaway}</p></section>
          {article.sources && <section className="article-sources" aria-labelledby="sources-title"><h2 id="sources-title">Источники и область применения</h2><ul>{article.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel={source.url.startsWith(`${site.catalogOrigin}/`) ? 'noopener' : 'noopener noreferrer'}>{source.title}<Icon name="outward" /><span className="sr-only"> (откроется в новой вкладке)</span></a>{source.note && <p>{source.note}</p>}</li>)}</ul></section>}
          <ArticleCallout article={article} />
        </div>
      </div>
    </article>
    <BlogSection articles={related} related />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData(article)).replace(/</g, '\\u003c') }} />
  </main>;
}
