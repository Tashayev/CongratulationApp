export const LANGUAGES = ['ru', 'en', 'kz'] as const;

export type TLanguage = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: TLanguage = 'ru';

export const LANGUAGE_LABELS: Record<TLanguage, string> = {
  ru: 'Русский',
  en: 'English',
  kz: 'Қазақша',
};