import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useRouter } from "next/router"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import ErrorParagraph from "@/components/Error"
import useAppContext from "@/hooks/useAppContext"

const Contact = () => {
  const [err, setErr] = useState(null)
  const { t } = useTranslation()
  const router = useRouter()
  const {
    actions: { writeContactMessage },
  } = useAppContext()

  const handleSubmit = useCallback(
    async ({ email, title, text }) => {
      setErr(null)

      const response = await writeContactMessage(email, title, text)

      if (response[0]) {
        setErr(response[0])

        return
      }

      router.push("/")
    },
    [router, writeContactMessage]
  )

  const initialValues = {
    email: "",
    subject: "",
    text: "",
  }

  const validationSchema = yup.object().shape({
    email: yup.string().required(t("E.emailError")).email(t("E.emailInvalid")),
    title: yup.string().required(t("E.subjectError")),
    text: yup.string().required(t("E.textError")),
  })

  return (
    <Page title={t("contact.title")}>
      <div className="pt-20">
        <div>
          <h1 className="text-my-dark-brown text-center text-xl font-semibold">
            {t("contact.title")}
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
                name="email"
                label={t("contact.email")}
                type="email"
                placeholder={t("contact.email")}
                className="w-80"
              />
              <FormField
                name="title"
                label={t("contact.subject")}
                placeholder={t("contact.subject")}
                className="w-80"
              />
              <FormField
                name="text"
                label={t("contact.text")}
                isTextArea={true}
                placeholder={t("contact.text")}
                className="w-80"
              />
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-my-dark-brown font-semibold px-4 py-2 mt-10 rounded-full"
              >
                {t("contact.send")}
              </button>
              {err && <ErrorParagraph messageError={t("E.basic")} />}
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  )
}

Contact.isPublic = true
export default Contact
