import { Formik, Form } from "formik"
import * as yup from "yup"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ImageField from "@/components/ImageField"
import ErrorParagraph from "@/components/Error"

const initialValues = {
  files: "",
}

const validationSchema = yup.object().shape({
  files: yup.mixed().required("A file is required"),
})

const AddImage = () => {
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, uploadImage },
  } = useAppContext()
  const [err, setErr] = useState(null)
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { files } = values
      const [err] = await uploadImage(files)

      if (err != null) {
        setErr(err)

        return
      }

      router.push("/back-office/images/list")
    },
    [router, uploadImage]
  )

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.images.add")}
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
              allowMultiple={true}
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
AddImage.isPublic = false
export default AddImage
