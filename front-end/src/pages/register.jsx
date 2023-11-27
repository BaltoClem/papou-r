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

const Register = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [err, setErr] = useState(null)

  const initialValues = {
    name: "",
    email: "",
    password: "",
  }

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("E.nameError")).label(t("register.name")),
    email: yup.string().required(t("E.emailError")).email(t("E.emailInvalid")),
    password: yup
      .string()
      .required(t("E.passwordError"))
      .min(12, t("E.passwordLengthError"))
      .matches(/[a-z]/, t("E.passwordLowerCaseError"))
      .matches(/[A-Z]/, t("E.passwordUpperCaseError"))
      .matches(/[0-9]/, t("E.passwordNumberError"))
      .matches(/[@$!%*#?&]/, t("E.passwordSpecialCharError")),
    phone_number: yup
      .string()
      .required(t("E.phoneNumberError"))
      .matches(/[+](?:[0-9]●?){6,14}[0-9]/, t("E.phoneNumberInvalid")),
  })

  const {
    actions: { signUp },
  } = useAppContext()

  const handleSubmit = useCallback(
    async ({ email, password, name, phone_number }) => {
      setErr(null)
      const [error] = await signUp(email, password, name, phone_number)

      if (error) {
        setErr(error)

        return
      }

      router.push("/login")
    },
    [signUp, router]
  )

  return (
    <Page title={t("register.title")}>
      <main className="pt-28">
        <div>
          <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
            {t("register.title")}
          </h1>
        </div>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          error={err}
        >
          {({ isSubmitting, isValid }) => (
            <Form className="flex flex-col items-center gap-4 p-4">
              <FormField
                name="name"
                label={t("register.nameLabel")}
                placeholder={t("register.namePlaceholder")}
                className="w-80"
              />
              <FormField
                name="phone_number"
                label={t("register.phoneNumberLabel")}
                placeholder={t("register.phoneNumberPlaceholder")}
                className="w-80"
              />
              <FormField
                name="email"
                label={t("register.emailLabel")}
                type="email"
                placeholder={t("register.emailPlaceholder")}
                className="w-80"
              />
              <FormField
                name="password"
                label={t("register.passwordLabel")}
                type="password"
                placeholder={t("register.passwordPlaceholder")}
                className="w-80"
              />
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 mt-10 rounded-full"
              >
                {t("register.submit")}
              </button>
              {err && <ErrorParagraph messageError={t("E.basic")} />}
            </Form>
          )}
        </Formik>
        <div className="flex flex-col items-center mt-8">
          <span className="text-my-dark-brown">
            {t("register.alreadyHaveAccount")}
          </span>
          <div>
            <Link
              href="/login"
              name="login"
              id="login"
              className="text-my-light-brown hover:text-my-brown hover:underline font-semibold mb-6"
            >
              {t("register.loginLink")}
            </Link>
          </div>
        </div>
      </main>
    </Page>
  )
}

Register.isPublic = true
export default Register
