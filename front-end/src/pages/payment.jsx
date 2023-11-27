import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import Link from "next/link"
import { useTranslation } from "react-i18next"

const Display = () => {
  const { t } = useTranslation()
  const {
    state: { session },
  } = useAppContext()

  return (
    <Page title={t("Succès")}>
      <section className="flex justify-center items-center flex-col h-[80vh]">
        <p> Votre achat a bien été confirmé !</p>
        <Link href={`/user/${session.user.id}/orders`} className="underline">
          Voir plus d'infos sur mes commandes
        </Link>
      </section>
    </Page>
  )
}

export default Display
