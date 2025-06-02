
import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n-config';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return {
    title: {
      template: `%s | ${dictionary.appName}`,
      default: dictionary.appName,
    },
    description: dictionary.hero.subtitle,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <>
      {/* The lang property is added to html tag by next-intl or manually if not using it */}
      {/* For basic Next.js i18n, we can set it here or rely on RootLayout if it receives lang */}
      {/* For simplicity, assuming RootLayout handles general html/body and this injects lang-specific content */}
      <Header lang={lang} dictionary={dictionary.nav} appName={dictionary.appName} />
      <main className="flex-grow">
        {children}
      </main>
      <FloatingActionButton dictionary={dictionary.chatWidget} currentLang={lang} />
      <Footer lang={lang} dictionary={dictionary.footer} appName={dictionary.appName} />
    </>
  );
}
