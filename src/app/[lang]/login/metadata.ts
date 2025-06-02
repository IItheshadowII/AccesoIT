import { Metadata } from 'next';
import { Locale } from '@/lib/i18n-config';
import { getDictionary } from '@/lib/dictionaries';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const lang = params.lang as Locale;
  const dict = await getDictionary(lang);

  return {
    title: dict.login.title,
    description: dict.login.description,
  };
}
