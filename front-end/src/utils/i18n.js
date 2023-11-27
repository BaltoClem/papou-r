import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enTranslation from "@/locales/en.json"
import frTranslation from "@/locales/fr.json"
import gdTranslation from "@/locales/gd.json"

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: enTranslation },
    fr: { translation: frTranslation },
    gd: { translation: gdTranslation },
  },
})

export default i18n
