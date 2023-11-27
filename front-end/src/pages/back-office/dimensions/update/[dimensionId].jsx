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
import { getDimensionsByIdService } from "@/services/dimensions"

const emptyValues = {
  width: "",
  height: "",
  length: "",
}

const buildInitialValues = (dimension) => {
  if (dimension == null) {
    return emptyValues
  }

  const initialValues = {
    width: dimension.width,
    height: dimension.height,
    length: dimension.length,
  }

  return initialValues
}

export const getServerSideProps = async (context) => {
  const { dimensionId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getDimension = getDimensionsByIdService(args)
  const [dimensionError, dimensionData] = await getDimension(dimensionId)

  if (dimensionError) {
    return {
      props: {
        error: dimensionError,
        dimensionId: dimensionId,
      },
    }
  }

  return {
    props: {
      dimension: dimensionData.result,
    },
  }
}

const validationSchema = yup.object().shape({
  width: yup.number().required("Width is required"),
  height: yup.number().required("Height is required"),
  length: yup.number().required("Lenght is required"),
})

const UpdateDimension = (props) => {
  const { error, dimensionId, dimension } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, updateDimensions },
  } = useAppContext()
  const [err, setErr] = useState(error)
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      const { width, height, length } = values
      updateDimensions(dimension.id, width, height, length).then(([error]) => {
        if (error) {
          setErr(error)

          return
        }

        router.push("/back-office/dimensions/list")
      })
    },
    [dimensionId, router, updateDimensions]
  )

  const initialValues = buildInitialValues(dimension)

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("backOffice.dimensions.update.noDimensionFound", {
            dimensionId: dimensionId.toString(),
          })}
        />
      ) : (
        <div>
          <h1 className="flex place-content-center font-black text-xl">
            {t("back-office.dimensions.update")}
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
                {err && (
                  <ErrorParagraph messageError={t("E.INVALID_CREDENTIAL")} />
                )}
              </Form>
            )}
          </Formik>
        </div>
      )}
    </Page>
  )
}
UpdateDimension.isPublic = false
export default UpdateDimension
