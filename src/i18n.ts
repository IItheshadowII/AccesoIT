import { createTranslator as createTranslatorIntl } from 'next-intl';

export function createTranslator(locale: string) {
  const dictionary = require(`./dictionaries/${locale}.ts`);
  return createTranslatorIntl(dictionary);
}
