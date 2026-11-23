'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './icons';

type Props = {
  navigation: { href: string; label: string }[];
  phone: string;
  phoneHref: string;
  email: string;
  catalogUrl: string;
};

export function Header({ navigation, phone, phoneHref, email, catalogUrl }: Props) {
  const emailHref = `mailto:${email}`;
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    }
    function closeOutside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    }
    const media = window.matchMedia('(min-width: 1080px)');
    const closeOnDesktop = () => { if (media.matches) setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    media.addEventListener('change', closeOnDesktop);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
      media.removeEventListener('change', closeOnDesktop);
    };
  }, [open]);

  return (
    <header className="site-header" ref={header}>
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label="ПроРельс — на главную" onClick={() => setOpen(false)}>
          <Image src="/images/prorels-logo.png" width={990} height={304} alt="ПроРельс. Рельсы, шпалы, крепёж" priority sizes="(max-width: 600px) 190px, 240px" />
        </Link>
        <nav className="desktop-nav" aria-label="Основная навигация">
          {navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
        <div className="header-contact">
          <a className="header-phone" href={phoneHref}>{phone}</a>
          <a className="header-email" href={emailHref}>Почта: {email}</a>
          <span>Отдел продаж · Пн–Пт, 8:00–17:00</span>
        </div>
        <a className="header-call" href={phoneHref} aria-label={`Позвонить: ${phone}`}><Icon name="phone" /></a>
        <button ref={button} className={`menu-toggle${open ? ' is-open' : ''}`} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </div>
      <nav id="mobile-navigation" className="mobile-navigation" aria-label="Мобильная навигация" hidden={!open}>
        <div className="container">
          {navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}<Icon name="arrow" /></Link>)}
          <a className="mobile-catalog" href={catalogUrl}>Смотреть каталог<Icon name="outward" /></a>
          <a href={phoneHref}>{phone}<Icon name="phone" /></a>
          <a href={emailHref}>Почта: {email}<Icon name="mail" /></a>
        </div>
      </nav>
    </header>
  );
}
