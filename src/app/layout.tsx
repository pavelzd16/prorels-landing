import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/manrope';
import '@fontsource-variable/golos-text';
import { identity, site } from '@/lib/site';
import { BrandPalette } from '@/components/brand-palette';
import { Metrika } from '@/components/metrika';
import './globals.css';
import '@/components/contact-form.css';

export const metadata: Metadata = {
  metadataBase: new URL(identity.origin ?? 'http://127.0.0.1:4193'),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  robots: { index: identity.indexable, follow: identity.indexable, ...(identity.indexable ? { googleBot: { index: true, follow: true, 'max-image-preview': 'large' as const } } : {}) },
  openGraph: { type: 'website', locale: 'ru_RU', siteName: site.name, title: site.title, description: site.description },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, yandex: process.env.YANDEX_SITE_VERIFICATION || undefined },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#151D25' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body><BrandPalette /><a className="skip-link" href="#main">Перейти к содержимому</a>{children}<Metrika /></body></html>;
}
