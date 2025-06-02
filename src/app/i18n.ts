import { createI18n } from 'next-intl';
import { NextRequest } from 'next/server';

const i18n = createI18n({
  locales: ['en', 'es'],
  defaultLocale: 'en',
  localeDetection: true,
  middleware: {
    async getLocale(request: NextRequest) {
      const { headers } = request;
      const acceptLanguage = headers.get('accept-language') || 'en';
      
      // Use the first language from the accept-language header
      const languages = acceptLanguage.split(',')[0].split('-')[0];
      
      // Return the first matching locale
      return languages in i18n.locales ? languages : i18n.defaultLocale;
    }
  }
});

export default i18n;
