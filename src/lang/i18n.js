import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationZH from "../lang/locales/ch/ch_trans.json";
import translationEN from "../lang/locales/en/en_trans.json";
import translationKM from "../lang/locales/kh/kh_trans.json";

const resources = {
  en: {
    translation: translationEN,
  },
  kh: {
    translation: translationKM,
  },
  ch: {
    translation: translationZH,
  },
};

const savedLang = localStorage.getItem('app_lang') || 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app_lang', lng);
});

export default i18n;
