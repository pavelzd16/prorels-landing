import Image from "next/image";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BlogSection } from "@/components/blog";
import { ContactForm } from "@/components/contact-form";
import { getPublishedArticles } from "@/content/articles";
import { Icon, type IconName } from "@/components/icons";
import {
  catalogUrl,
  categories,
  faq,
  identity,
  navigation,
  site,
  structuredData,
} from "@/lib/site";

export const metadata: Metadata = identity.origin
  ? {
      alternates: { canonical: "/" },
      openGraph: {
        type: "website",
        locale: "ru_RU",
        siteName: site.name,
        title: site.title,
        description: site.description,
        url: `${identity.origin}/`,
      },
    }
  : {};

const audiences: { icon: IconName; name: string; text: string }[] = [
  {
    icon: "rails",
    name: "Железнодорожные предприятия",
    text: "Для строительства, ремонта и обслуживания путей.",
  },
  {
    icon: "factory",
    name: "Промышленные предприятия",
    text: "Для подъездных и подкрановых путей на производстве.",
  },
  {
    icon: "crane",
    name: "Строительные организации",
    text: "Для комплектации объектов по проектной спецификации.",
  },
  {
    icon: "terminal",
    name: "Логистические комплексы",
    text: "Для путевой инфраструктуры складов и терминалов.",
  },
];

export default function Home() {
  return (
    <>
      <Header
        navigation={navigation}
        phone={site.phone}
        phoneHref={site.phoneHref}
        email={site.email}
        catalogUrl={catalogUrl}
      />
      <main id="main">
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="hero-photo">
            <Image
              src="/images/railway.jpg"
              alt="Железнодорожный путь: рельсы, шпалы и скрепления"
              fill
              sizes="(max-width: 767px) 100vw, 65vw"
              preload
              quality={85}
            />
          </div>
          <div className="hero-angle" aria-hidden="true" />
          <div className="container hero-content">
            <div className="eyebrow light">
              <span />
              МАТЕРИАЛЫ ВЕРХНЕГО СТРОЕНИЯ ПУТИ
            </div>
            <h1 id="hero-title">
              Рельсы. Шпалы.
              <br />
              Крепёж.
              <br />
              <span>Основа вашего пути.</span>
            </h1>
            <p className="hero-description">
              Комплектуем железнодорожные пути —<br className="desktop-break" />{" "}
              от одного соединения до целого объекта.
              <br className="desktop-break" /> Поставляем по России и СНГ.
            </p>
            <div className="hero-actions">
              <a className="button button-orange" href={catalogUrl}>
                Смотреть каталог
                <Icon name="outward" />
              </a>
              <a className="button button-outline" href="#contacts">
                Обсудить поставку
                <Icon name="arrow" />
              </a>
            </div>
            <a className="hero-location" href="#delivery">
              <Icon name="pin" />
              <span>
                Зеленодольск<span className="location-divider">/</span>Работаем
                по всей России
              </span>
            </a>
          </div>
          <div className="hero-caption" aria-hidden="true">
            <span>#ПроРельс</span>
            <span>Надёжность в каждом соединении</span>
          </div>
        </section>

        <div className="service-strip">
          <div className="container service-strip-inner">
            <div>
              <Icon name="box" />
              <span>
                <strong>Комплексные поставки</strong>
                <small>Материалы по вашей спецификации</small>
              </span>
            </div>
            <div>
              <Icon name="document" />
              <span>
                <strong>Сопроводительные документы</strong>
                <small>Паспорта и сертификаты на продукцию</small>
              </span>
            </div>
            <div>
              <Icon name="truck" />
              <span>
                <strong>Доставка до объекта</strong>
                <small>По России и странам СНГ</small>
              </span>
            </div>
          </div>
        </div>

        <section
          id="products"
          className="section products"
          aria-labelledby="products-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">ПРОДУКЦИЯ</div>
                <h2 id="products-title">Всё, что держит путь</h2>
              </div>
              <p>
                Основные категории материалов ВСП.
                <br />
                Характеристики и выбор позиций — в каталоге.
              </p>
            </div>
            <div className="product-grid">
              {categories.map((category) => (
                <a
                  className="product-card"
                  key={category.slug}
                  href={`${catalogUrl}/${category.slug}`}
                >
                  <div className="product-image">
                    <Image
                      src={`/images/${category.image}`}
                      alt={category.alt}
                      fill
                      sizes="(max-width: 599px) 90vw, (max-width: 1000px) 44vw, 30vw"
                    />
                  </div>
                  <div className="product-copy">
                    <h3>{category.name}</h3>
                    <p>{category.detail}</p>
                  </div>
                  <span className="product-arrow">
                    <Icon name="outward" />
                  </span>
                </a>
              ))}
            </div>
            <div className="catalog-bottom">
              <p>
                Нужны стрелочные переводы, путевой инструмент или другие
                материалы?
              </p>
              <a className="text-link" href={catalogUrl}>
                Весь каталог
                <Icon name="outward" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="section audience-section"
          aria-labelledby="audience-title"
        >
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">ДЛЯ ВАШИХ ЗАДАЧ</div>
                <h2 id="audience-title">
                  Соединяем материалы
                  <br />с вашими проектами
                </h2>
              </div>
              <p>
                Понимаем, что нужно снабжению.
                <br />
                Работаем с предприятиями разных отраслей.
              </p>
            </div>
            <div className="audience-grid">
              {audiences.map((item) => (
                <article key={item.name} className="audience-item">
                  <Icon name={item.icon} />
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section about-section"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div className="about-intro">
              <div className="eyebrow">О КОМПАНИИ</div>
              <h2 id="about-title">
                Один поставщик.
                <br />
                Весь комплект.
              </h2>
              <p>
                «ПроРельс» — материалы для железнодорожной инфраструктуры.
                Помогаем собрать поставку под задачу: от ремонта участка до
                строительства новых путей.
              </p>
              <p>
                Работаем с новыми и старогодными материалами. Согласуем
                характеристики, объём партии и документы до отгрузки, организуем
                доставку на ваш объект.
              </p>
              <a className="text-link" href={`${site.catalogOrigin}/about`}>
                Подробнее о компании
                <Icon name="outward" />
              </a>
            </div>
            <div className="benefit-grid">
              <article>
                <Icon name="box" />
                <h3>Подбор по спецификации</h3>
                <p>
                  Соберём рельсы, шпалы и крепёж в одну поставку. Проверим марки
                  и комплектность.
                </p>
              </article>
              <article>
                <Icon name="document" />
                <h3>Качество в документах</h3>
                <p>
                  Предоставим сопроводительную документацию. Согласуем
                  требования ГОСТ и ТУ для нужных позиций.
                </p>
              </article>
              <article>
                <Icon name="terminal" />
                <h3>Собственный склад</h3>
                <p>
                  Отгружаем из Зеленодольска. Наличие конкретной партии уточним
                  при расчёте заявки.
                </p>
              </article>
              <article>
                <Icon name="truck" />
                <h3>Логистика под заказ</h3>
                <p>
                  Подберём способ перевозки с учётом длины, веса материалов и
                  адреса вашего объекта.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="delivery"
          className="delivery-section"
          aria-labelledby="delivery-title"
        >
          <div className="container">
            <div className="delivery-top">
              <div>
                <div className="eyebrow light">ГЕОГРАФИЯ ПОСТАВОК</div>
                <h2 id="delivery-title">
                  От нашего склада.
                  <br />
                  <span>До вашего объекта.</span>
                </h2>
              </div>
              <div className="delivery-description">
                <p>
                  Поставляем материалы по России и СНГ. Доставку рассчитываем
                  под ваш заказ — по объёму, направлению и необходимым срокам.
                </p>
                <a
                  href={`${site.catalogOrigin}/delivery`}
                  className="text-link light-link"
                >
                  Условия доставки
                  <Icon name="outward" />
                </a>
              </div>
            </div>
            <div
              className="delivery-route"
              aria-label="Маршрут поставки: склад в Зеленодольске — ваш объект в России или СНГ"
            >
              <div className="route-point">
                <span className="route-dot" />
                <small>НАШ СКЛАД</small>
                <strong>Зеленодольск</strong>
                <span>Республика Татарстан</span>
              </div>
              <div className="route-line" aria-hidden="true">
                <Icon name="truck" />
                <span />
              </div>
              <div className="route-point route-destination">
                <span className="route-dot" />
                <small>ВАШ ОБЪЕКТ</small>
                <strong>Россия и СНГ</strong>
                <span>Доставка или самовывоз</span>
              </div>
            </div>
            <ol className="steps">
              <li>
                <span className="step-number">01</span>
                <div>
                  <h3>Отправьте спецификацию</h3>
                  <p>
                    Наименования, количество и город доставки. Чертежи — если
                    нужны особые детали.
                  </p>
                </div>
              </li>
              <li>
                <span className="step-number">02</span>
                <div>
                  <h3>Согласуйте поставку</h3>
                  <p>
                    Уточним наличие, подготовим предложение и договоримся об
                    условиях.
                  </p>
                </div>
              </li>
              <li>
                <span className="step-number">03</span>
                <div>
                  <h3>Получите материалы</h3>
                  <p>
                    Укомплектуем заказ, подготовим документы и организуем
                    отгрузку.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="section faq-section" aria-labelledby="faq-title">
          <div className="container faq-grid">
            <div>
              <div className="eyebrow">ПЕРЕД ЗАКАЗОМ</div>
              <h2 id="faq-title">
                О поставке —<br />
                по делу
              </h2>
              <p>
                Не нашли ответ?
                <br />
                <a className="inline-link" href={site.phoneHref}>
                  Позвоните менеджеру
                </a>
              </p>
            </div>
            <div className="faq-items">
              {faq.map((item) => (
                <details key={item.question}>
                  <summary>
                    {item.question}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <BlogSection articles={getPublishedArticles().slice(0, 3)} />

        <section
          id="contacts"
          className="contacts-section"
          aria-labelledby="contacts-title"
        >
          <div className="container contacts-grid">
            <div className="contacts-main">
              <div className="eyebrow">НАЧНЁМ С ВАШЕЙ ЗАДАЧИ</div>
              <h2 id="contacts-title">
                Обсудим
                <br />
                вашу поставку?
              </h2>
              <p>
                Пришлите список материалов. Поможем с подбором
                <br className="desktop-break" /> и подготовим коммерческое
                предложение.
              </p>
              <a className="contact-phone" href={site.phoneHref}>
                {site.phone}
                <Icon name="outward" />
              </a>
              <a className="contact-email" href={`mailto:${site.email}`}>
                {site.email}
                <Icon name="arrow" />
              </a>
              <p className="contact-hours">{site.hours}</p>
            </div>
            <div className="contact-card">
              <div className="contact-card-heading">
                <Icon name="document" />
                <span>РАСЧЁТ КОМПЛЕКТАЦИИ</span>
              </div>
              <h3>Получить расчёт поставки</h3>
              <p>Расскажите, какие материалы нужны. Уточним детали и подготовим предложение.</p>
              <ContactForm />
              <div className="contact-card-divider" />
              <span className="catalog-hint">Ещё выбираете материалы?</span>
              <a className="text-link" href={catalogUrl}>
                Посмотреть каталог на prorelsa.ru
                <Icon name="outward" />
              </a>
            </div>
          </div>
          <div className="container contacts-address">
            <div>
              <Icon name="pin" />
              <span>{site.address}</span>
            </div>
            <div>
              <Icon name="phone" />
              <a href={site.officePhoneHref}>{site.officePhone}</a>
              <span className="office-label">Офис</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
