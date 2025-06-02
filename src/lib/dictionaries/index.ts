import type { Dictionary } from '@/lib/types/Dictionary';

export async function getDictionary(lang: string): Promise<Dictionary> {
  try {
    const dictionary = await import(`../dictionaries/${lang}.ts`);
    return dictionary.default;
  } catch (error) {
    console.error('Error loading dictionary:', error);
    // Fallback to English if translation file is not found
    const defaultDictionary = await import('../dictionaries/en.ts');
    return defaultDictionary.default;
  }
}
