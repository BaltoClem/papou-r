import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { createApi } from "@/services/api"
import { confirmUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import icons from "@/asset/linkCommonAsset"
import Link from "@/components/Link"

export const getServerSideProps = async (context) => {
  const jwt = context.query?.jwt
  const api = createApi({ jwt: jwt })
  const confirmUser = confirmUserService({ api, errorHandler })
  const [error, data] = await confirmUser()

  if (error) {
    return { props: { error: error } }
  }

  return {
    props: { user: data.result, jwt: jwt },
  }
}

const UserPage = (props) => {
  const { error, user } = props

  const { t } = useTranslation()

  return (
    <Page title={t("user.confirmationLink")}>
      {error || !user ? (
        <p className="flex justify-center items-center text-xl py-4">
          {t(error)}
        </p>
      ) : (
        <main className="flex flex-col gap-3 h-80 justify-center items-center">
          <p className="text-center py-4 text-xl"> {t("user.confirmed")}</p>
          <Link
            href="/login"
            img={icons.login}
            alt={t("header.login")}
            width={45}
            height={45}
            spanClassName="pt-2 pl-3 text-xl text-my-dark-brown"
            text={t("header.login")}
          />
        </main>
      )}
    </Page>
  )
}

UserPage.isPublic = true
export default UserPage
