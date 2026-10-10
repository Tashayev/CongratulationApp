import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findBestLanguageTag } from 'react-native-localize';

import en from './translations/en';
import ru from './translations/ru';
import kz from './translations/kz';
import { DEFAULT_LANGUAGE, LANGUAGES, type TLanguage } from './const';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  kz: { translation: kz },
};

const detectLanguage = (): TLanguage => {
  const best = findBestLanguageTag([...LANGUAGES]);
  return (best?.languageTag as TLanguage) ?? DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;