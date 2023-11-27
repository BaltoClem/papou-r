import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "./../components/layout/Page"
import ErrorParagraph from "@/components/Error"
import useAppContext from "@/hooks/useAppContext"

const initialValues = {
  email: "",
  password: "",
}

const validationSchema = yup.object().shape({
  email: yup.string().required("No Email provided").email(),
  password: yup.string().required("No password provided."),
})

const Login = () => {
  const [err, setErr] = useState(null)
  const { t } = useTranslation()
  const router = useRouter()
  const {
    actions: { signIn },
  } = useAppContext()

  const handleSubmit = useCallback(
    async ({ email, password }) => {
      setErr(null)
      const [error] = await signIn(email, password)

      if (error) {
        setErr(error)

        return
      }

      router.push("/")
    },
    [signIn, router]
  )

  return (
    <Page title={t("login.title")}>
      <main className="pt-28">
        <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
          {t("login.title")}
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
                type="email"
                placeholder={t("login.emailPlaceholder")}
                className="w-80"
              />
              <FormField
                name="password"
                label={t("login.passwordLabel")}
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                className="w-80"
              />
              <div>
                <Link
                  href="/forgotten_password"
                  name="forgottenPassword"
                  id="forgottenPassword"
                  className="text-my-light-brown hover:text-my-brown hover:underline font-semibold mb-2"
                >
                  {t("login.forgottenPassword")}
                </Link>
              </div>
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 mt-10 rounded-full"
              >
                {t("login.submit")}
              </button>
              {err && <ErrorParagraph messageError={t(err)} />}
            </Form>
          )}
        </Formik>
        <div className="flex flex-col items-center mt-8">
          <span className="text-my-dark-brown">{t("login.noAccount")}</span>
          <div>
            <Link
              href="/register"
              name="register"
              id="register"
              className="text-my-light-brown hover:text-my-brown hover:underline font-semibold mb-6"
            >
              {t("login.registerLink")}
            </Link>
          </div>
        </div>
      </main>
    </Page>
  )
}

Login.isPublic = true
export default Login
