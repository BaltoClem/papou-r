import useAppContext from "@/hooks/useAppContext"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import ErrorParagraph from "@/components/Error"
import { Formik, Form } from "formik"
import FormField from "@/components/FormField"
import * as yup from "yup"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"

export const getServerSideProps = async (context) => {
  const userId = context.params.userId

  return { props: { userId: userId } }
}

const initialValues = {
  fullname: "",
  street_name: "",
  zipcode: "",
  city: "",
  country: "",
  complement: "",
}

const validationSchema = yup.object().shape({
  fullname: yup.string().required("No full name provided"),
  street_name: yup.string().required("No street name provided"),
  zipcode: yup.string().required("No zipcode provided."),
  city: yup.string().required("No city provided"),
  country: yup.string().required("No country provided"),
  complement: yup.string(),
})

const CreateAddress = (props) => {
  const { userId } = props
  const {
    actions: { createAddress },
  } = useAppContext()
  const { t } = useTranslation()
  const [err, setErr] = useState(null)
  const router = useRouter()

  const handleSubmit = useCallback(
    async ({ fullname, street_name, zipcode, city, country, complement }) => {
      setErr(null)

      const response = await createAddress(
        fullname,
        street_name,
        zipcode,
        city,
        country,
        complement,
        userId
      )

      if (response[0]) {
        setErr(response[0])

        return
      }

      router.back()
    },
    [createAddress, router, userId]
  )

  return (
    <Page title={t("addresses.create.title")}>
      <main className="pt-28">
        <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl">
          {t("addresses.create.title")}
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
                name="fullname"
                label={t("addresses.create.fullnameLabel")}
                type="text"
                placeholder={t("addresses.create.fullnamePlaceholder")}
                className="w-80"
              />
              <FormField
                name="street_name"
                label={t("addresses.create.streetNameLabel")}
                type="text"
                placeholder={t("addresses.create.streetNamePlaceholder")}
                className="w-80"
              />
              <FormField
                name="zipcode"
                label={t("addresses.create.zipcodeLabel")}
                type="text"
                placeholder={t("addresses.create.zipcodePlaceholder")}
                className="w-80"
              />
              <FormField
                name="city"
                label={t("addresses.create.cityLabel")}
                type="text"
                placeholder={t("addresses.create.cityPlaceholder")}
                className="w-80"
              />
              <FormField
                name="country"
                label={t("addresses.create.countryLabel")}
                type="text"
                placeholder={t("addresses.create.countryPlaceholder")}
                className="w-80"
              />
              <FormField
                name="complement"
                label={t("addresses.create.complementLabel")}
                type="text"
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

CreateAddress.isPublic = true
export default CreateAddress
