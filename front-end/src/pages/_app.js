import "@/styles/style.css"
import { AppContextProvider } from "@/hooks/useAppContext"
import { I18nextProvider } from "react-i18next"
import i18n from "@/utils/i18n"
import { CookiesProvider } from "react-cookie"

export default function AppContext({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <AppContextProvider isPublicPage={Component.isPublic}>
        <I18nextProvider i18n={i18n}>
          <Component {...pageProps} />
        </I18nextProvider>
      </AppContextProvider>
    </CookiesProvider>
  )
}
