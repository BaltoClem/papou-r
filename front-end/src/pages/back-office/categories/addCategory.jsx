import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ErrorParagraph from "@/components/Error"
import ImageField from "@/components/ImageField"

const initialValues = {
  name: "",
  slug: "",
  description: "",
  files: "",
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  slug: yup.string().required("Slug Is required"),
  files: yup.mixed().required("A file is required"),
})

const AddCategory = () => {
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, createCategory },
  } = useAppContext()
  const router = useRouter()
  const [err, setErr] = useState(null)

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { name, slug, description, imageUrl } = values
      createCategory(name, slug, description, imageUrl).then(([error]) => {
        if (error != null) {
          setErr(error)

          return
        }

        router.push("/back-office/categories/list")
      })
    },
    [createCategory, router]
  )

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.categories.add")}
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid, setFieldValue }) => (
          <Form className="flex flex-col items-center gap-4 p-4">
            <ImageField
              name="files"
              label={t("back-office.addProduct.imageLabel")}
              accepts="image/*"
              className="border-2 border-black px-2 py-1 w-80"
              handleChange={(event) => {
                setFieldValue("files", event.target.files)
              }}
              allowMultiple={false}
            />
            <FormField
              name="name"
              label={t("back-office.categories.name")}
              placeholder="my Name"
              className="w-80"
            />
            <FormField
              name="description"
              label={t("back-office.categories.description")}
              type="string"
              placeholder="my description"
              className="w-80"
            />
            <FormField
              name="slug"
              label={t("back-office.categories.slug")}
              placeholder="my Slug"
              className="w-80"
            />
            <button
              disabled={isSubmitting || !isValid}
              type="submit"
              className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-black font-semibold px-3 py-2 mt-10"
            >
              {t("back-office.addProduct.validate")}
            </button>
            {err && <ErrorParagraph messageError={t("E.INVALID_CREDENTIAL")} />}
          </Form>
        )}
      </Formik>
    </Page>
  )
}
AddCategory.isPublic = false
export default AddCategory
