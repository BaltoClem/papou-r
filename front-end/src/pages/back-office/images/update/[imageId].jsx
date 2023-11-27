import { Formik, Form } from "formik"
import * as yup from "yup"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ImageField from "@/components/ImageField"
import ErrorParagraph from "@/components/Error"
import Image from "next/image"
import { createApi } from "@/services/api"
import { getImageService } from "@/services/images"
import errorHandler from "@/utils/errorHandler"

const initialValues = {
  files: "",
}

const validationSchema = yup.object().shape({
  files: yup.mixed().required("A file is required"),
})

export const getServerSideProps = async (context) => {
  const { imageId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getImage = getImageService(args)
  const [errorImage, dataImage] = await getImage(imageId)

  if (errorImage) {
    return {
      props: {
        error: errorImage,
        categoryId: imageId,
      },
    }
  }

  return {
    props: {
      image: dataImage.result,
    },
  }
}

const UpdateImage = (props) => {
  const { error, image, imageId } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, updateImage },
  } = useAppContext()
  const [updateError, setUpdateError] = useState(null)

  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { files } = values
      const [err] = await updateImage(image.id, files)

      if (err) {
        setUpdateError(err)

        return
      }

      router.push("/back-office/images/list")
    },
    [image, router, updateImage]
  )

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("image.noImageFound", {
            categoryId: imageId.toString(),
          })}
        />
      ) : (
        <div>
          <h1 className="flex justify-center font-black text-xl">
            {t("back-office.images.update")}
          </h1>

          {image ? (
            <div className="flex justify-center">
              <div className="h-[200px] w-full sm:h-[250px] sm:w-[300px] sm:min-w-[200px] lg:h-[300px] lg:w-[350px] relative">
                <Image
                  src={image.url}
                  alt={t("carousel.imageAlt")}
                  className="bg-my-brown object-cover"
                  fill
                />
              </div>
            </div>
          ) : (
            <></>
          )}

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
                <button
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  className="bg-my-salmon active:bg-rose-600 disabled:opacity-50 text-black font-semibold px-3 py-2 mt-10"
                >
                  {t("back-office.addProduct.validate")}
                </button>
                {updateError && <ErrorParagraph messageError={updateError} />}

              </Form>
            )}
          </Formik>
        </div>
      )}
    </Page>
  )
}
UpdateImage.isPublic = false
export default UpdateImage
