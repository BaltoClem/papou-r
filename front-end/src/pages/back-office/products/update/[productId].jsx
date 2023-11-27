import { useCallback, useState } from "react"
import Page from "@/components/layout/Page"
import * as yup from "yup"
import { Formik, Form } from "formik"
import FormField from "@/components/FormField"
import DropDownField from "@/components/DropDownField"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/router"
import useAppContext from "@/hooks/useAppContext"
import ErrorParagraph from "@/components/Error"
import Image from "next/image"
import MyCustomButton from "@/components/MyCustomButton"
import ImageField from "@/components/ImageField"
import { getProductService } from "@/services/products"
import { createApi } from "@/services/api"
import errorHandler from "@/utils/errorHandler"
import { getCategoriesService } from "@/services/categories"
import { getMaterialsService } from "@/services/materials"
import { getDimensionsService } from "@/services/dimensions"


const ImageList = (props) => {
  const { t } = useTranslation()
  const { images, productId } = props
  const {
    actions: { deleteImagesOfProduct },
  } = useAppContext()
  const [err, setErr] = useState(null)

  const handleDeleteImage = useCallback(
    (imageId) => async () => {
      const [error] = await deleteImagesOfProduct(productId, imageId)

      if (error) {
        setErr(error)

        return
      }

      window.location.reload()
    },
    [deleteImagesOfProduct, productId]
  )

  return (
    <>
      <div className="w-full flex flex-row flex-wrap px-2 mx-2 justify-center gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className="flex-col h-2 w-full sm:h-[250px] sm:w-[300px] sm:min-w-[200px] lg:h-[200px] lg:w-[250px] relative overflow-x-hidden"
          >
            <Image
              src={image.url}
              alt={t("carousel.imageAlt")}
              className="bg-my-brown object-cover relative"
              fill
            />
            <MyCustomButton
              name="Delete"
              classNameButton="bg-blue-200 absolute"
              onClick={handleDeleteImage(image.id)}
            ></MyCustomButton>
          </div>
        ))}
      </div>
      {err && <ErrorParagraph messageError={err} />}
    </>
  )
}

const validationSchema = yup.object().shape({
  description: yup.string().required("Include a description"),
  name: yup.string().required("No Name provided."),
  price: yup.number().required("Price is required"),
  stock: yup.number().required("Stock is required"),
  dimensions: yup.number().required("Dimensions needed"),
})

export const getServerSideProps = async (context) => {
  const { productId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getProduct = getProductService(args)
  const getCategories = getCategoriesService(args)
  const getMaterials = getMaterialsService(args)
  const getDimensions = getDimensionsService(args)

  const [errorProduct, productData] = await getProduct(productId)

  if (errorProduct) {
    return {
      props: {
        error: errorProduct,
        productId: productId,
      },
    }
  }

  const categoriesData = await getCategories(null, 1)
  const materialsData = await getMaterials(null, 1)
  const dimensionsData = await getDimensions(null, 1)

  return {
    props: {
      product: productData.result,
      categories: categoriesData.result.categories,
      materials: materialsData.data.result.materials,
      dimensions: dimensionsData.data.result.dimensions,
    },
  }
}

const UpdateProduct = (props) => {
  const { error, productId, product, categories, materials, dimensions } = props
  const { t } = useTranslation()
  const {
    actions: {
      checkIsAdmin,
      updateProduct,
      updateProductCategory,
      updateMaterialsOfProduct,
      updateImagesOfProduct,
      uploadImage,
    },
  } = useAppContext()
  const [err, setErr] = useState(null)
  const router = useRouter()

  checkIsAdmin()

  dimensions.forEach((elem) => {
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
      " : " +
      elem.length
  })

  categories.forEach((elem) => {
    elem.label = elem.name
  })

  materials.forEach((elem) => {
    elem.label = elem.name
  })

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

      if (files) {
        const [errUploadImages, newImagesData] = await uploadImage(files)

        if (errUploadImages) {
          setErr(errUploadImages)

          return
        }

        const imagesIds = newImagesData.result.map((image) => image.id)

        const [errLinkImages] = await updateImagesOfProduct(

          product.id,
          imagesIds
        )

        if (errLinkImages) {
          setErr(errLinkImages)

          return
        }
      }

      const [errProductCategory] = await updateProductCategory(
        product.id,
        categories
      )

      if (errProductCategory) {
        setErr(errProductCategory)

        return
      }

      const [errProductMaterial] = await updateMaterialsOfProduct(
        product.id,
        materials
      )

      if (errProductMaterial) {
        setErr(errProductMaterial)

        return
      }

      const [updateErr] = await updateProduct(
        product.id,
        description,
        name,
        price,
        stock,
        dimensions
      )

      if (updateErr) {
        setErr(updateErr)

        return
      }

      router.push("/back-office/products/list")
    },
    [

      product,
      router,
      updateImagesOfProduct,
      updateMaterialsOfProduct,
      updateProduct,
      updateProductCategory,
      uploadImage,
    ]
  )

  const initialValues = {
    description: product.description,
    name: product.name,
    price: product.price,
    stock: product.stock,
    dimensions: product.dimension_id,
    categories: product.product_categories.map((category) => category.id),
    materials: product.product_materials.map((material) => material.id),
  }

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("backOffice.products.noProductFound", {
            productId: productId.toString(),
          })}
        />
      ) : (
        <div>
          <h1 className="flex place-content-center font-black text-xl">
            {t("back-office.addProduct.update")}
          </h1>
          {product.product_images.length > 0 ? (
            <div className="flex flex-col items-center">
              <h2>Images</h2>
              <ImageList
                images={product.product_images}
                productId={product.id}
              />
            </div>
          ) : (
            <></>
          )}
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            error={err}
            enableReinitialize={true}
          >
            {({ isSubmitting, isValid, setFieldValue }) => {
              return (
                <Form className="flex flex-col items-center gap-4 p-4">
                  <ImageField
                    name="files"
                    label={t("back-office.addProduct.addImageLabel")}
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
                    value="Bib"
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
              )
            }}
          </Formik>
        </div>
      )}
    </Page>
  )
}

UpdateProduct.isPublic = false
export default UpdateProduct
