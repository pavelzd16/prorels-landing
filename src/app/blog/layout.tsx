import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { catalogUrl, navigation, site } from '@/lib/site';
import './blog.css';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Header
      navigation={navigation}
      phone={site.phone}
      phoneHref={site.phoneHref}
      email={site.email}
      catalogUrl={catalogUrl}
    />
    {children}
    <Footer />
  </>;
}
