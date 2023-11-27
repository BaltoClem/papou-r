import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import ErrorParagraph from "@/components/Error"
import { Formik, Form } from "formik"
import FormField from "@/components/FormField"
import * as yup from "yup"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
import { updatePasswordUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import { createApi } from "@/services/api"
import { t } from "i18next"

const initialValues = {
  email: "",
}

export const getServerSideProps = async (context) => {
  const jwt = context.query?.jwt

  return { props: { jwt: jwt } }
}

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required(t("E.passwordError"))
    .min(12, t("E.passwordLengthError"))
    .matches(/[a-z]/, t("E.passwordLowerCaseError"))
    .matches(/[A-Z]/, t("E.passwordUpperCaseError"))
    .matches(/[0-9]/, t("E.passwordNumberError"))
    .matches(/[@$!%*#?&]/, t("E.passwordSpecialCharError")),
})

const UpdatePassword = (props) => {
  const [err, setErr] = useState(null)
  const { jwt } = props
  const api = createApi({ jwt: jwt })
  const args = { api, errorHandler }
  const updateUserPassword = updatePasswordUserService(args)

  const { t } = useTranslation()
  const router = useRouter()

  const handleSubmit = useCallback(
    async ({ password }) => {
      setErr(null)

      const response = await updateUserPassword(password)

      if (response[0]) {
        setErr(response[0])

        return
      }

      router.push("/login")
    },
    [updateUserPassword, router]
  )

  return (
    <Page title={t("login.newPassword")}>
      <main className="pt-28">
        <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
          {t("login.newPassword")}
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
                name="password"
                label={t("login.passwordLabel")}
                type="password"
                placeholder={t("login.passwordPlaceholder")}
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

UpdatePassword.isPublic = true
export default UpdatePassword
