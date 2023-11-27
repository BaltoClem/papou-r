import Carousel from "@/components/Carousel"
import ErrorParagraph from "@/components/Error"
import Page from "@/components/layout/Page"
import MyCustomButton from "@/components/MyCustomButton"
import Product from "@/components/Product"
import useAppContext from "@/hooks/useAppContext"
import { createApi } from "@/services/api"
import { getCartOfUserService } from "@/services/cart"
import { getDimensionsByIdService } from "@/services/dimensions"
import { getProductService } from "@/services/products"
import errorHandler from "@/utils/errorHandler"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

export const getServerSideProps = async (context) => {
  const { productId } = context.params
  const api = createApi({
    jwt: context.req.cookies.session,
    uuid: context.req.cookies.uuid,
  })

  const args = { api, errorHandler }
  const getProduct = getProductService(args)
  const [errorProduct, dataProduct] = await getProduct(productId)

  if (errorProduct) {
    return { props: { error: errorProduct } }
  }

  const getCart = getCartOfUserService(args)
  const [errorCart, dataCart] = await getCart()

  const product = dataProduct.result

  if (errorCart) {
    return { props: { error: errorCart, product: product } }
  }

  const getDimension = getDimensionsByIdService(args)
  const [errorDim, dataDim] = await getDimension(product.dimension_id)

  if (errorDim) {
    return {
      props: {
        error: errorDim,
        product: product,
      },
    }
  }

  return {
    props: {
      product: { ...product, dimensions: dataDim.result },
      cart: dataCart.result,
    },
  }
}

const getArrayOfImagesUrl = (product) => {
  if (!product.product_images) {
    return []
  }

  let images = []
  product.product_images.forEach((productImage) => {
    images.push(productImage.url)
  })

  return images
}

const SimilarProducts = (props) => {
  const { similarProducts } = props

  return (
    <div className="flex flex-col gap-6 w-full px-2 justify-center sm:justify-normal sm:mx-0 sm:w-auto sm:flex-row sm:overflow-x-auto sm:max-w-[80%] sm:gap-20 sm:h-auto mt-14 sm:pb-6">
      {similarProducts.map((product, index) => (
        <Product
          key={index}
          name={product.name}
          price={product.price}
          img={product.product_images[0].url}
          productId={product.id}
        />
      ))}
    </div>
  )
}

const quantityInCart = (productId, cart) => {
  let quantity = 0

  cart.products.forEach((product) => {
    if (Number.parseInt(product.id) === Number.parseInt(productId)) {
      quantity = product.quantity
    }
  })

  return quantity
}

const ProductPage = (props) => {
  const { product, error, cart } = props
  const images = getArrayOfImagesUrl(product)
  const [err, setErr] = useState(null)
  const [added, setAdded] = useState(false)
  const [noQuantityValid, setNoQuantityValid] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const {
    actions: { addProductToCart },
  } = useAppContext()
  const { t } = useTranslation()
  const similarProducts = product.related_products

  const handleChooseQuantity = useCallback(
    (option) => {
      if (option.target.value > product.stock) {
        option.target.value = product.stock
      }

      setQuantity(Number.parseInt(option.target.value))
    },
    [product.stock]
  )

  const handleClickAddProductButton = useCallback(async () => {
    setErr(null)
    setAdded(false)
    setNoQuantityValid(null)

    if (quantity <= 0) {
      setNoQuantityValid("product.quantityInvalid")

      return
    }

    if (quantityInCart(product.id, cart) + quantity > product.stock) {
      setNoQuantityValid("product.notEnoughStock")

      return
    }

    const [error, data] = await addProductToCart(product.id, quantity)

    if (error) {
      setErr(error)

      return
    }

    setAdded(data !== null)
  }, [addProductToCart, cart, product.id, product.stock, quantity])

  const getProductMaterials = () => {
    return product.product_materials.reduce((acc, material, index) => {
      index === product.product_materials.length - 1
        ? acc + material.name
        : acc + material.name + ", "
    }, "")
  }

  return (
    <Page>
      {error ? (
        <ErrorParagraph messageError={t(error)} />
      ) : (
        <div>
          <div className="flex flex-col lg:flex-row justify-center gap-10">
            <Carousel
              images={images}
              imageDefault="https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/productImageDefault.jpg"
              className="w-full h-[25rem] lg:w-[550px] lg:h-[450px] xl:w-[700px] xl:h-[600px] flex-none lg:mt-10 lg:border-8 border-my-dark-brown"
            ></Carousel>
            <div className="flex flex-col gap-12 mx-4 w-auto lg:w-[40%] justify-center">
              <div>
                <div className="flex justify-between">
                  <p className="text-my-dark-brown text-3xl font-bold">
                    {product.name}
                  </p>
                  <p className="text-my-dark-brown text-3xl">
                    {product.price} £
                  </p>
                </div>
                <p className="text-my-brown">
                  {product.stock > 0
                    ? `${t("product.stock")} : ${product.stock}`
                    : t("product.noStock")}
                </p>
              </div>
              <p className="text-my-dark-brown text-justify">
                {product.description}
              </p>
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center gap-10 w-full">
                  {product.stock > 0 && (
                    <input
                      type="number"
                      min="0"
                      max={product.stock}
                      onChange={handleChooseQuantity}
                      required
                      step="1"
                      className="text-my-dark-brown bg-my-light-brown border border-my-dark-brown rounded-full px-2 w-20"
                    ></input>
                  )}
                  <MyCustomButton
                    disabled={product.stock <= 0}
                    name={t("product.addProduct")}
                    onClick={handleClickAddProductButton}
                    classNameButton="w-[15rem] xl:w-[20rem] disabled:opacity-50 rounded-full shadow-lg shadow-slate-400 active:shadow-inner active:shadow-slate-400"
                  />
                </div>
                {err && (
                  <ErrorParagraph
                    messageError={t("product.cannotAddProduct")}
                    className="pt-4"
                  />
                )}
                {added && (
                  <p className="text-my-brown">
                    {t("product.productAdded", {
                      productName: product.name,
                    })}
                  </p>
                )}
                {noQuantityValid && (
                  <ErrorParagraph
                    messageError={t(noQuantityValid)}
                    className="pt-4"
                  />
                )}
              </div>
              <div className="text-my-dark-brown flex flex-col gap-6">
                <div>
                  <p>
                    <span className="text-xl font-semibold">
                      {t("product.materials")} :
                    </span>{" "}
                    {getProductMaterials()}
                  </p>
                </div>
                <div>
                  <p className="text-xl font-semibold">
                    {t("product.dimensions.title")} :
                  </p>
                  <p className="ml-4">
                    <span className="font-semibold">
                      {t("product.dimensions.width")} :{" "}
                    </span>
                    {product.dimensions.width}cm
                  </p>
                  <p className="ml-4">
                    <span className="font-semibold">
                      {t("product.dimensions.length")} :{" "}
                    </span>
                    {product.dimensions.length}cm
                  </p>
                  <p className="ml-4">
                    <span className="font-semibold">
                      {t("product.dimensions.height")} :{" "}
                    </span>
                    {product.dimensions.height}cm
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-10">
            <p className="mx-10 text-3xl">{t("product.similarProducts")}</p>
            {similarProducts && similarProducts.length > 0 ? (
              <SimilarProducts similarProducts={similarProducts} />
            ) : (
              <ErrorParagraph messageError={t("product.noSimilarProducts")} />
            )}
          </div>
        </div>
      )}
    </Page>
  )
}

ProductPage.isPublic = true
export default ProductPage
