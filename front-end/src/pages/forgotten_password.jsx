import useAppContext from "@/hooks/useAppContext"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import ErrorParagraph from "@/components/Error"
import { Formik, Form } from "formik"
import FormField from "@/components/FormField"
import * as yup from "yup"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"

const initialValues = {
  email: "",
}

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
})

const ForgottenPassword = () => {
  const {
    actions: { sendForgottenPassword },
  } = useAppContext()
  const { t } = useTranslation()
  const [err, setErr] = useState(null)
  const router = useRouter()

  const handleSubmit = useCallback(
    async ({ email }) => {
      setErr(null)

      const response = await sendForgottenPassword(email)

      if (response[0]) {
        setErr(response[0])

        return
      }

      router.back()
    },
    [sendForgottenPassword, router]
  )

  return (
    <Page title={t("login.forgottenPassword")}>
      <main className="pt-28">
        <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
          {t("login.forgottenPassword")}
        </h1>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          error={err}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col items-center gap-4 p-4">
              <FormField
                name="email"
                label={t("login.emailLabel")}
                type="text"
                placeholder={t("login.emailPlaceholder")}
                className="w-80"
              />
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 mt-10 rounded-full"
              >
                {t("addresses.create.submit")}
              </button>
              {err && <ErrorParagraph messageError={t(err)} />}
            </Form>
          )}
        </Formik>
      </main>
    </Page>
  )
}

ForgottenPassword.isPublic = true
export default ForgottenPassword
