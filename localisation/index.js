import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import ms from './ms.json';
import zh from './zh.json';
import ta from './ta.json';

const resources = {
  en: {
    translation: en,
  },
  ms: {
    translation: ms,
  },
  zh: {
    translation: zh,
  },
  ta: {
    translation: ta,
  },
};

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

const supportedLanguages = ['en', 'ms', 'zh', 'ta'];

const initialLanguage = supportedLanguages.includes(deviceLanguage)
  ? deviceLanguage
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,

    lng: initialLanguage,

    fallbackLng: 'en',

    interpolation: {
      escapeValue: false,
    },

    compatibilityJSON: 'v4',
  });

export default i18n;
