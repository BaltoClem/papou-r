import Page from "@/components/layout/Page"
import { t } from "i18next"

const LegalPages = () => {
  return (
    <Page title={t("footer.legalInformation")}>
      <div className="h-[80vh] flex justify-center items-center">
        <div className="p-6 shadow-lg rounded-lg w-[80vw] h-min">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            {t("footer.legalInformation")}
          </h1>
          <div className="text-gray-700 flex justify-center items-center flex-col">
            <p>{t("legal.info")}</p>
            <p>
              <b>{t("user.phoneNumber")} :</b> 06 68 45 12 39
            </p>
            <p>
              <b>{t("user.email")} :</b> sdvb3g2@gmail.com
            </p>
            <p>
              <b>{t("legal.dev")} :</b> Marine ; Lïlo ; Étienne ; Joachim ; Chat
              GPT
            </p>
          </div>
        </div>
      </div>
    </Page>
  )
}

LegalPages.isPublic = true
export default LegalPages
