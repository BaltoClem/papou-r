import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ErrorParagraph from "@/components/Error"
import { createApi } from "@/services/api"
import errorHandler from "@/utils/errorHandler"
import { getMaterialService } from "@/services/materials"

const validationSchema = yup.object().shape({
  name: yup.string().required("No Name provided."),
})

export const getServerSideProps = async (context) => {
  const { materialId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getMaterial = getMaterialService(args)
  const [errorMaterial, dataMaterial] = await getMaterial(materialId)

  if (errorMaterial) {
    return {
      props: {
        error: errorMaterial,
        materialId: materialId,
      },
    }
  }

  return {
    props: {
      material: dataMaterial.result,
    },
  }
}

const AddMaterial = (props) => {
  const { error, materialId, material } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, updateMaterial },
  } = useAppContext()
  const [err, setErr] = useState(null)
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { name } = values

      const [error] = await updateMaterial(material.id, name)

      if (error) {
        setErr(error)

        return
      }

      router.push("/back-office/materials/list")
    },
    [material, router, updateMaterial]
  )

  const initialValues = {
    name: material.name,
  }

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("backOffice.materials.noMaterialFound", {
            materialId: materialId,
          })}
        />
      ) : (
        <div>
          <h1 className="flex place-content-center font-black text-xl">
            {t("back-office.materials.update")}
          </h1>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize={true}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="flex flex-col items-center gap-4 p-4">
                <FormField
                  name="name"
                  label={t("back-office.materials.materialNameLabel")}
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
                {err && <ErrorParagraph messageError={err} />}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </Page>
  )
}
AddMaterial.isPublic = false
export default AddMaterial
