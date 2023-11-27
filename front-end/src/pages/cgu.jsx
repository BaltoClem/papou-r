import Page from "@/components/layout/Page"
import { t } from "i18next"

const CGUPages = () => {
  return (
    <Page title="CGU">
      <div className="h-[80vh] flex justify-center items-center">
        <div className="p-6 shadow-lg rounded-lg w-[80vw] h-min">
          <h1 className="text-2xl font-semibold mb-4">{t("CGU.title")}</h1>
          <div className="text-gray-700">{t("CGU.body")}</div>
        </div>
      </div>
    </Page>
  )
}

CGUPages.isPublic = true
export default CGUPages
