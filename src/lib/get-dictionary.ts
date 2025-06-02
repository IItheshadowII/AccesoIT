import type { Locale } from './i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('@/lib/dictionaries/en').then((module) => module.default),
  es: () => import('@/lib/dictionaries/es').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return locale && dictionaries[locale] ? dictionaries[locale]() : dictionaries.en();
};
