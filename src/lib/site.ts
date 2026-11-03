import { resolveSiteIdentity } from './origin';

export const identity = resolveSiteIdentity(process.env);
export const site = {
  name: 'ПроРельс',
  title: 'Рельсы, шпалы и крепёж с доставкой по России — ПроРельс',
  description: 'ПроРельс — поставки материалов верхнего строения пути: железнодорожные и крановые рельсы, шпалы, крепёж и скрепления. Комплектация объектов, доставка по России и СНГ. Склад в Зеленодольске.',
  catalogOrigin: 'https://prorelsa.ru',
  phone: '+7 (965) 615-50-59',
  phoneHref: 'tel:+79656155059',
  officePhone: '8 (800) 600-12-87',
  officePhoneHref: 'tel:88006001287',
  email: 'zakaz@prorelsa.ru',
  address: 'г. Зеленодольск, ул. Московская, зд. 4, помещ. 1',
  hours: 'Пн–Пт, 8:00–17:00',
  legalName: 'ООО «ИНВИА»',
  inn: '1648052000',
  ogrn: '1201600037055',
};

export const catalogUrl = `${site.catalogOrigin}/catalog`;
export const quoteEmail = `mailto:${site.email}?subject=${encodeURIComponent('Запрос на поставку материалов ВСП — ПроРельс')}`;
export const navigation = [
  { href: '/#products', label: 'Продукция' },
  { href: '/#about', label: 'О компании' },
  { href: '/#delivery', label: 'Доставка' },
  { href: '/blog', label: 'Блог' },
  { href: '/#contacts', label: 'Контакты' },
];

export const categories = [
  { name: 'Железнодорожные рельсы', detail: 'Магистральные, узкоколейные, рудничные', slug: 'zheleznodorozhnye-relsy', image: 'zheleznodorozhnye-relsy.jpg', alt: 'Профиль железнодорожных рельсов' },
  { name: 'Шпалы и переводной брус', detail: 'Деревянные и железобетонные', slug: 'zhd-shpaly', image: 'zhd-shpaly.jpg', alt: 'Деревянная и железобетонная шпалы' },
  { name: 'Путевой крепёж', detail: 'Болты, гайки, шайбы и костыли', slug: 'zhd-krepezh', image: 'zhd-krepezh.jpg', alt: 'Крепёж для соединения элементов железнодорожного пути' },
  { name: 'Крановые рельсы', detail: 'Для подкрановых путей предприятий', slug: 'kranovye-relsy', image: 'kranovye-relsy.jpg', alt: 'Крановые рельсы с широкой головкой' },
  { name: 'Рельсовые скрепления', detail: 'Комплектующие ЖБР и АРС', slug: 'relsovoe-skreplenie-zhbr-ars', image: 'relsovoe-skreplenie-zhbr-ars.jpg', alt: 'Рельсовые скрепления для железобетонных шпал' },
  { name: 'Стыковые накладки', detail: 'Для соединения рельсовых стыков', slug: 'stykovye-zhd-nakladki', image: 'stykovye-zhd-nakladki.jpg', alt: 'Металлические накладки для рельсовых стыков' },
];

export const faq = [
  { question: 'Как запросить цену и наличие?', answer: 'Выберите нужные позиции в каталоге prorelsa.ru или отправьте спецификацию на zakaz@prorelsa.ru. Укажите наименование, марку, количество и город доставки. Менеджер уточнит наличие, стоимость партии и условия отгрузки.' },
  { question: 'Можно ли заказать комплект материалов для объекта?', answer: 'Да. По вашей спецификации подберём рельсы, шпалы, скрепления и путевой крепёж. Если в проекте есть особые требования к материалам или документам, укажите их в запросе.' },
  { question: 'Поставляете ли вы старогодные материалы?', answer: 'В основном каталоге есть раздел старогодных материалов ВСП. Состояние, износ, доступный объём и возможность применения конкретной партии необходимо согласовать с менеджером до заказа.' },
  { question: 'Как организована доставка и самовывоз?', answer: 'Отгрузка — со склада в Зеленодольске. Организуем поставки по России и СНГ; способ перевозки, стоимость и сроки зависят от объёма и направления. Самовывоз согласуйте с отделом продаж заранее.' },
];

export function structuredData() {
  const organizationId = `${site.catalogOrigin}/#organization`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: site.name,
        legalName: site.legalName,
        taxID: site.inn,
        url: site.catalogOrigin,
        ...(identity.origin ? { logo: `${identity.origin}/images/prorels-logo.png` } : {}),
        email: site.email,
        telephone: '+79656155059',
        address: { '@type': 'PostalAddress', streetAddress: 'ул. Московская, зд. 4, помещ. 1', addressLocality: 'Зеленодольск', addressRegion: 'Республика Татарстан', postalCode: '422549', addressCountry: 'RU' },
      },
      ...(identity.origin ? [{
        '@type': 'WebSite',
        '@id': `${identity.origin}/#website`,
        url: `${identity.origin}/`,
        name: site.name,
        inLanguage: 'ru-RU',
        publisher: { '@id': organizationId },
      }] : []),
    ],
  };
}
