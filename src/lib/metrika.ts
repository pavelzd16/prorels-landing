/**
 * Яндекс.Метрика лэнда prorels.com. Номер счётчика не секрет — он виден
 * в коде каждой страницы. 114100270 — отдельный счётчик лэнда; у каталога
 * prorelsa.ru свой счётчик 112450496, здесь он не подключается и не трогается.
 *
 * В боевой сборке счётчик включён по умолчанию, при `npm run dev` выключен,
 * чтобы не портить статистику. NEXT_PUBLIC_METRIKA_ID при сборке задаёт другой
 * номер, любое нечисловое значение (например off) отключает Метрику совсем.
 */
export const DEFAULT_METRIKA_ID = 114100270;

export function resolveMetrikaId(configured: string | undefined, production: boolean): number | undefined {
  const value = (configured ?? '').trim();
  if (value === '') return production ? DEFAULT_METRIKA_ID : undefined;
  return /^\d+$/.test(value) ? Number(value) : undefined;
}

export const metrikaId = resolveMetrikaId(process.env.NEXT_PUBLIC_METRIKA_ID, process.env.NODE_ENV === 'production');

/**
 * Цель «Отправка формы» (тип «JavaScript-событие», идентификатор forma).
 * Засчитывается только после успешной отправки: сервер принял заявку и
 * посетитель видит подтверждение. Ошибки проверки и отправки цель не дают.
 */
export const FORM_GOAL = 'forma';

/**
 * Цель «Переход на prorelsa.ru» (тип «JavaScript-событие», идентификатор
 * perehod_prorelsa): нажатие на любую ссылку, ведущую в каталог prorelsa.ru, —
 * кнопки «Смотреть каталог», категории, «О компании», «Доставка», политика,
 * источники в статьях. С параметром визита «Переход на prorelsa.ru» →
 * страница лэнда → адрес ссылки.
 */
export const CATALOG_GOAL = 'perehod_prorelsa';

const catalogHosts = new Set(['prorelsa.ru', 'www.prorelsa.ru']);

/** Ведёт ли ссылка в каталог prorelsa.ru. */
export function isCatalogHref(href: string | null | undefined, base = 'https://prorels.com/'): boolean {
  if (!href) return false;
  try {
    const url = new URL(href, base);
    return (url.protocol === 'https:' || url.protocol === 'http:') && catalogHosts.has(url.hostname);
  } catch {
    return false;
  }
}

type Ym = ((id: number, action: string, ...args: unknown[]) => void) & { a?: unknown[][]; l?: number };

declare global {
  interface Window { ym?: Ym }
}

/**
 * Засчитывает цель. Ошибка счётчика сюда не выходит: заявка и переход
 * в каталог не должны зависеть от того, загрузилась ли Метрика.
 */
export function metrikaReachGoal(goal: string, params?: Record<string, unknown>): void {
  if (!metrikaId || typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    if (params) window.ym(metrikaId, 'reachGoal', goal, params);
    else window.ym(metrikaId, 'reachGoal', goal);
  } catch {
    // Счётчик сломан или заблокирован — цель теряется, сайт работает.
  }
}

/** Сообщает Метрике о переходе внутри лэнда (Next.js меняет страницы без перезагрузки). */
export function metrikaHit(url: string, referer: string): void {
  if (!metrikaId || typeof window.ym !== 'function') return;
  try { window.ym(metrikaId, 'hit', url, { referer }); } catch { /* Сайт не зависит от счётчика. */ }
}

let started = false;

/** Код счётчика из кабинета Метрики, разложенный по шагам. */
export function startMetrika(): boolean {
  if (!metrikaId || started) return false;
  started = true;
  if (!window.ym) {
    const queue: Ym = (...args: unknown[]) => { (queue.a ??= []).push(args); };
    queue.l = Date.now();
    window.ym = queue;
  }
  const src = `https://mc.yandex.ru/metrika/tag.js?id=${metrikaId}`;
  if (!Array.from(document.scripts).some(script => script.src === src)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.append(script);
  }
  window.ym(metrikaId, 'init', { ssr: true, webvisor: true, clickmap: true, referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });
  return true;
}
