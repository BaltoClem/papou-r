import { Formik, Form } from "formik"
import * as yup from "yup"
import FormField from "@/components/FormField"
import { useCallback, useEffect, useState } from "react"
import DropDownField from "@/components/DropDownField"
import ImageField from "@/components/ImageField"
import { useTranslation } from "react-i18next"
import ErrorParagraph from "@/components/Error"
import Page from "@/components/layout/Page"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"

const initialValues = {
  files: "",
  description: "",
  name: "",
  price: 0,
  stock: 0,
  dimensions: "",
  categories: [],
}

const validationSchema = yup.object().shape({
  files: yup.mixed().required("A file is required"),
  description: yup.string().required("Include a description"),
  name: yup.string().required("No Name provided."),
  price: yup.number().required("Price is required"),
  stock: yup.number().required("Stock is required"),
  dimensions: yup.number().required("Dimensions needed"),
})

const getData = async (
  getDimensions,
  getCategories,
  getMaterials,
  setDimensions,
  setCategories,
  setMaterials,
  t
) => {
  getDimensions().then((response) => {
    const dimensionList = response.data.result
    dimensionList.forEach((elem) => {
      elem.label =
        t("back-office.addProduct.widthLabel") +
        " : " +
        elem.width +
        ", " +
        t("back-office.addProduct.heightLabel") +
        " : " +
        elem.height +
        ", " +
        t("back-office.addProduct.lengthLabel") +
        " : "
    })
    setDimensions(dimensionList)
  })

  getCategories(200, 1).then((data) => {
    const categoriesList = data.result.categories
    categoriesList.forEach((elem) => {
      elem.label = elem.name
    })
    setCategories(categoriesList)
  })

  getMaterials().then((response) => {
    const materialsList = response.data.result
    materialsList.forEach((elem) => {
      elem.label = elem.name
    })
    setMaterials(materialsList)
  })
}

const AddProduct = () => {
  const { t } = useTranslation()
  const {
    actions: {
      checkIsAdmin,
      createProduct,
      getCategories,
      getDimensions,
      getMaterials,
      uploadImage,
      updateProductCategory,
      updateMaterialsOfProduct,
      updateImagesOfProduct,
    },
  } = useAppContext()
  const [dimensions, setDimensions] = useState([])
  const [categories, setCategories] = useState([])
  const [materials, setMaterials] = useState([])
  const [err, setErr] = useState(null)
  const router = useRouter()

  checkIsAdmin()

  const handleSubmit = useCallback(
    async (values) => {
      setErr(null)
      const {
        files,
        description,
        name,
        price,
        stock,
        dimensions,
        categories,
        materials,
      } = values

      var [err, imageData] = await uploadImage(files)

      if (err != null) {
        setErr(err)

        return
      }

      const [productErr, productData] = await createProduct(
        description,
        name,
        price,
        stock,
        dimensions
      )

      if (productErr) {
        setErr(productErr)

        return
      }

      const [errProductCategory] = await updateProductCategory(
        productData.result.product.id,
        categories
      )

      if (errProductCategory) {
        setErr(errProductCategory)

        return
      }

      const [errProductMaterial] = await updateMaterialsOfProduct(
        productData.result.product.id,
        materials
      )

      if (errProductMaterial) {
        setErr(errProductMaterial)

        return
      }

      const [errImages] = await updateImagesOfProduct(
        productData.result.product.id,
        imageData.result.map((image) => image.id)
      )

      if (errImages) {
        setErr(errImages)

        return
      }

      router.push("/back-office/products/list")
    },
    [
      createProduct,
      router,
      updateImagesOfProduct,
      updateMaterialsOfProduct,
      updateProductCategory,
      uploadImage,
    ]
  )

  useEffect(() => {
    getData(
      getDimensions,
      getCategories,
      getMaterials,
      setDimensions,
      setCategories,
      setMaterials,
      t
    )
  }, [getCategories, getDimensions, getMaterials, t])

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.addProduct.add")}
      </h1>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        error={err}
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
            <FormField
              name="description"
              label={t("back-office.addProduct.descriptionLabel")}
              type="string"
              placeholder="MyImageName"
              className="w-80"
            />
            <FormField
              name="name"
              label={t("back-office.addProduct.productNameLabel")}
              type="string"
              placeholder="My Product Name"
              className="w-80"
            />
            <FormField
              name="price"
              label={t("back-office.addProduct.priceLabel")}
              type="number"
              placeholder="001"
              className="w-80"
            />
            <FormField
              name="stock"
              label={t("back-office.addProduct.stockLabel")}
              type="number"
              placeholder="001"
              className="w-80"
            />
            <DropDownField
              value=""
              name="dimensions"
              label={t("back-office.addProduct.dimensionsLabel")}
              options={dimensions}
              className="border-2 border-black px-2 py-1 w-80"
              allowMultiple={false}
            />
            <DropDownField
              value=""
              name="categories"
              label={t("back-office.addProduct.categories")}
              options={categories}
              className="border-2 border-black px-2 py-1 w-80"
              allowMultiple={true}
            />
            <DropDownField
              value=""
              name="materials"
              label={t("back-office.addProduct.materials")}
              options={materials}
              className="border-2 border-black px-2 py-1 w-80"
              allowMultiple={true}
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
    </Page>
  )
}
AddProduct.isPublic = false
export default AddProduct
