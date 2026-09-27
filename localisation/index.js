// // import i18n from 'i18next';
// // import { initReactI18next } from 'react-i18next';
// // import * as Localization from 'expo-localization';

// // import en from './en.json';
// // import ms from './ms.json';
// // import zh from './zh.json';
// // import ta from './ta.json';

// // const resources = {
// //   en: {
// //     translation: en,
// //   },
// //   ms: {
// //     translation: ms,
// //   },
// //   zh: {
// //     translation: zh,
// //   },
// //   ta: {
// //     translation: ta,
// //   },
// // };

// // const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';

// // const supportedLanguages = ['en', 'ms', 'zh', 'ta'];

// // const initialLanguage = supportedLanguages.includes(deviceLanguage)
// //   ? deviceLanguage
// //   : 'en';

// // i18n
// //   .use(initReactI18next)
// //   .init({
// //     resources,

// //     lng: initialLanguage,

// //     fallbackLng: 'en',

// //     interpolation: {
// //       escapeValue: false,
// //     },

// //     compatibilityJSON: 'v4',
// //   });

// // export default i18n;
// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import * as Localization from 'expo-localization';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import en from './en.json';
// import ms from './ms.json';
// import zh from './zh.json';
// import ta from './ta.json';

// const LANGUAGE_STORAGE_KEY = '@prepwise_language';

// const resources = {
//   en: {
//     translation: en,
//   },
//   ms: {
//     translation: ms,
//   },
//   zh: {
//     translation: zh,
//   },
//   ta: {
//     translation: ta,
//   },
// };

// const supportedLanguages = ['en', 'ms', 'zh', 'ta'];

// const deviceLanguage =
//   Localization.getLocales()[0]?.languageCode || 'en';

// const initialLanguage = supportedLanguages.includes(deviceLanguage)
//   ? deviceLanguage
//   : 'en';

// i18n
//   .use(initReactI18next)
//   .init({
//     resources,

//     lng: initialLanguage,

//     fallbackLng: 'en',

//     interpolation: {
//       escapeValue: false,
//     },

//     compatibilityJSON: 'v4',
//   });

// export async function loadSavedLanguage() {
//   try {
//     const savedLanguage = await AsyncStorage.getItem(
//       LANGUAGE_STORAGE_KEY
//     );

//     if (
//       savedLanguage &&
//       supportedLanguages.includes(savedLanguage)
//     ) {
//       await i18n.changeLanguage(savedLanguage);
//       return savedLanguage;
//     }
//   } catch (error) {
//     console.warn(
//       'Unable to load saved language:',
//       error
//     );
//   }

//   return i18n.language;
// }

// export async function changeLanguage(language) {
//   if (!supportedLanguages.includes(language)) {
//     return;
//   }

//   try {
//     await i18n.changeLanguage(language);

//     await AsyncStorage.setItem(
//       LANGUAGE_STORAGE_KEY,
//       language
//     );
//   } catch (error) {
//     console.warn(
//       'Unable to change language:',
//       error
//     );
//   }
// }

// export { supportedLanguages };

// export default i18n;


// src/localisation/index.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const SUPPORTED_LANGUAGES = ['en', 'ms', 'zh', 'ta'];

export const LANGUAGE_STORAGE_KEY = '@prepwisesg_language';

const deviceLanguage =
  Localization.getLocales()[0]?.languageCode || 'en';

const initialLanguage = SUPPORTED_LANGUAGES.includes(deviceLanguage)
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

/*
|--------------------------------------------------------------------------
| CHANGE LANGUAGE
|--------------------------------------------------------------------------
*/

export async function changeLanguage(language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    console.warn(`Unsupported language: ${language}`);
    return false;
  }

  try {
    await AsyncStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      language
    );

    await i18n.changeLanguage(language);

    return true;
  } catch (error) {
    console.error(
      'Unable to change language:',
      error
    );

    return false;
  }
}

/*
|--------------------------------------------------------------------------
| LOAD SAVED LANGUAGE
|--------------------------------------------------------------------------
*/

export async function loadSavedLanguage() {
  try {
    const savedLanguage =
      await AsyncStorage.getItem(
        LANGUAGE_STORAGE_KEY
      );

    if (
      savedLanguage &&
      SUPPORTED_LANGUAGES.includes(savedLanguage)
    ) {
      await i18n.changeLanguage(savedLanguage);

      return savedLanguage;
    }

    return initialLanguage;
  } catch (error) {
    console.error(
      'Unable to load saved language:',
      error
    );

    return initialLanguage;
  }
}

export default i18n;
