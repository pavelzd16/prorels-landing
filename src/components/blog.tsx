import Link from 'next/link';
import { type Article, readingMinutes } from '@/content/articles';
import { catalogUrl } from '@/lib/site';
import { ContactForm } from './contact-form';
import { Icon } from './icons';
import './blog.css';

export function BlogLabel() {
  return <div className="blog-label"><span><Icon name="book" /></span>Блог ПроРельс</div>;
}

export function ArticleCard({ article, heading = 'h3' }: { article: Article; heading?: 'h2' | 'h3' }) {
  const Heading = heading;
  return <article className="article-card">
    <Link href={`/blog/${article.slug}`} aria-labelledby={`title-${article.slug}`}>
      <div className="article-card-meta"><span>{article.category}</span><span><Icon name="clock" />{readingMinutes(article)} мин</span></div>
      <Heading id={`title-${article.slug}`}>{article.title}</Heading>
      <p>{article.description}</p>
      <span className="article-card-link">Читать статью<Icon name="outward" /></span>
    </Link>
  </article>;
}

export function BlogSection({ articles, related = false }: { articles: Article[]; related?: boolean }) {
  if (!articles.length) return null;
  return <section id={related ? 'related' : 'blog'} className="section blog-section" aria-labelledby="blog-title">
    <div className="container">
      <div className="blog-section-heading">
        <div>
          <BlogLabel />
          <h2 id="blog-title">{related ? 'Ещё по теме' : <>Полезные материалы<br />для закупки ВСП</>}</h2>
          {!related && <p>О заявках, комплектации и доставке.<br />Помогаем подготовиться к поставке материалов.</p>}
        </div>
        <Link className="text-link" href="/blog">Все статьи<Icon name="outward" /></Link>
      </div>
      <div className={`article-grid${related ? ' article-grid-related' : ''}`}>
        {articles.map(article => <ArticleCard key={article.slug} article={article} />)}
      </div>
    </div>
  </section>;
}

export function ArticleCallout({ article }: { article: Article }) {
  return <section id="article-request" className="article-cta" aria-labelledby="article-cta-title">
    <div className="eyebrow light">ОТ ЗАДАЧИ К ПОСТАВКЕ</div>
    <h2 id="article-cta-title">{article.callout?.title ?? 'Обсудим вашу спецификацию?'}</h2>
    <p>{article.callout?.text ?? 'Пришлите перечень материалов, количество и город доставки. Уточним наличие и подготовим предложение.'}</p>
    <ContactForm sourcePath={`/blog/${article.slug}`} dark />
    <div className="article-cta-actions">
      <a className="text-link light-link" href={article.catalogCategory ? `${catalogUrl}/${article.catalogCategory}` : catalogUrl}>Смотреть каталог<Icon name="outward" /></a>
    </div>
  </section>;
}

export function Breadcrumbs({ title }: { title?: string }) {
  return <nav className="breadcrumbs" aria-label="Хлебные крошки"><ol>
    <li><Link href="/">Главная</Link></li>
    <li>{title ? <Link href="/blog">Блог</Link> : <span aria-current="page">Блог</span>}</li>
    {title && <li><span aria-current="page">{title}</span></li>}
  </ol></nav>;
}
