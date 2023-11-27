import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"

const initialValues = {
  width: "",
  height: "",
  length: "",
}

const validationSchema = yup.object().shape({
  width: yup.number().required("Width is required"),
  height: yup.number().required("Height is required"),
  length: yup.number().required("Length is required"),
})

const AddDimension = () => {
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, createDimensions },
  } = useAppContext()
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { width, height, length } = values
      await createDimensions(width, height, length)
      router.push("/back-office/dimensions/list")
    },
    [createDimensions, router]
  )

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.dimensions.add")}
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col items-center gap-4 p-4">
            <FormField
              name="width"
              label={t("back-office.dimensions.width")}
              type="number"
              placeholder="001"
              className="w-80"
            />
            <FormField
              name="height"
              label={t("back-office.dimensions.height")}
              type="number"
              placeholder="001"
              className="w-80"
            />
            <FormField
              name="length"
              label={t("back-office.dimensions.length")}
              type="number"
              placeholder="001"
              className="w-80"
            />
            <button
              disabled={isSubmitting || !isValid}
              type="submit"
              className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-black font-semibold px-3 py-2 mt-10"
            >
              {t("back-office.addProduct.validate")}
            </button>
          </Form>
        )}
      </Formik>
    </Page>
  )
}
AddDimension.isPublic = false
export default AddDimension
