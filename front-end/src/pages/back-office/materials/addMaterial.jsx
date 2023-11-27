import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"

const initialValues = {
  name: "",
}

const validationSchema = yup.object().shape({
  name: yup.string().required("No Name provided."),
})

const AddMaterial = () => {
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, createMaterial },
  } = useAppContext()
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { name } = values
      await createMaterial(name)
      router.push("/back-office/materials/list")
    },
    [createMaterial, router]
  )

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.materials.add")}
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid }) => (
          <Form className="flex flex-col items-center gap-4 p-4">
            <FormField
              name="name"
              label={t("back-office.materials.materialName")}
              type="string"
              placeholder="My Material Name"
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
AddMaterial.isPublic = false
export default AddMaterial
