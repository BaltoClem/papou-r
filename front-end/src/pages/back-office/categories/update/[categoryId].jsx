import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { createApi } from "@/services/api"
import { getCategoryService } from "@/services/categories"
import errorHandler from "@/utils/errorHandler"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ErrorParagraph from "@/components/Error"
import ImageField from "@/components/ImageField"
import Image from "next/image"

export const getServerSideProps = async (context) => {
  const { categoryId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getCategory = getCategoryService(args)
  const [errorCategory, dataCategory] = await getCategory(categoryId)

  if (errorCategory) {
    return {
      props: {
        error: errorCategory,
        categoryId: categoryId,
      },
    }
  }

  return {
    props: {
      category: dataCategory.result,
    },
  }
}

const emptyValues = {
  name: "",
  description: "",
  slug: "",
  imageUrl: "",
}

const buildInitialValues = (category) => {
  if (category == null) {
    return emptyValues
  }

  const initialValues = {
    name: category.name,
    description: category.description,
    slug: category.slug,
    imageUrl: category.image_url,
  }

  return initialValues
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  slug: yup.string().required("Slug Is required")
})

const UpdateCategory = (props) => {
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, updateCategory, uploadImage },
  } = useAppContext()
  const { error, category, categoryId } = props
  const [updateError, setUpdateError] = useState(null)

  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { name, description, slug, files } = values
      let imgUrl = category.image_url

      if (files) {
        const [uploadError, newImages] = await uploadImage(files)

        if (uploadError) {
          setUpdateError(uploadError)

          return
        }

        imgUrl = newImages.result[0].url
      }

      const [error] = await updateCategory(
        category.id,
        name,
        slug,
        description,
        imgUrl
      )

      if (error) {
        setUpdateError(error)

        return
      }

      router.push("/back-office/categories/list")
    },
    [category, router, updateCategory, uploadImage]
  )

  const initialValues = buildInitialValues(category, error)

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("category.noCategoryFound", {
            categoryId: categoryId.toString(),
          })}
        />
      ) : (
        <>
          <h1 className="flex justify-center font-black text-xl">
            {t("back-office.categories.update")}
          </h1>
          <div className="flex justify-center">
            <div className="h-[200px] w-full sm:h-[250px] sm:w-[300px] sm:min-w-[200px] lg:h-[300px] lg:w-[350px] relative">
              <Image
                src={category.image_url}
                alt={t("carousel.imageAlt")}
                className="bg-my-brown object-cover"
                fill
              />
            </div>
          </div>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize={true}
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
                {updateError && (
                  <ErrorParagraph messageError={t("E.INVALID_CREDENTIAL")} />
                )}
              </Form>
            )}
          </Formik>
        </>
      )}
    </Page>
  )
}
UpdateCategory.isPublic = false
export default UpdateCategory
