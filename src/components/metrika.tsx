'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CATALOG_GOAL, isCatalogHref, metrikaHit, metrikaId, metrikaReachGoal, startMetrika } from '@/lib/metrika';

/** Запуск счётчика, хиты при переходах внутри лэнда и цель «Переход на prorelsa.ru». */
export function Metrika() {
  const pathname = usePathname();
  const previous = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!metrikaId) return;
    startMetrika();
    function onClick(event: MouseEvent) {
      if (event.type === 'auxclick' && event.button !== 1) return;
      const link = (event.target as Element | null)?.closest?.('a[href]');
      const href = link?.getAttribute('href');
      if (!link || !isCatalogHref(href, window.location.href)) return;
      const target = new URL(href!, window.location.href).href;
      metrikaReachGoal(CATALOG_GOAL, { 'Переход на prorelsa.ru': { [window.location.pathname]: target } });
    }
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, []);

  useEffect(() => {
    const url = window.location.href;
    // Первый показ страницы считает init; дальше — переходы без перезагрузки.
    if (previous.current !== undefined && previous.current !== url) metrikaHit(url, previous.current);
    previous.current = url;
  }, [pathname]);

  if (!metrikaId) return null;
  return <noscript><div>
    {/* Пиксель для посетителей без JavaScript — как в коде из кабинета Метрики. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`https://mc.yandex.ru/watch/${metrikaId}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
  </div></noscript>;
}
