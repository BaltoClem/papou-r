import ErrorParagraph from "@/components/Error"
import MyCustomButton from "@/components/MyCustomButton"
import Page from "@/components/layout/Page"
import { createApi } from "@/services/api"
import { getCartOfUserService } from "@/services/cart"
import { getProductService } from "@/services/products"
import errorHandler from "@/utils/errorHandler"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import icons from "@/asset/linkCommonAsset"
import useAppContext from "@/hooks/useAppContext"
import { useCallback, useState } from "react"
import { useRouter } from "next/router"
import { t } from "i18next"

export const getServerSideProps = async (context) => {
  const api = createApi({
    jwt: context.req.cookies.session,
    uuid: context.req.cookies.uuid,
  })

  const args = { api, errorHandler }
  const getCart = getCartOfUserService(args)
  const [error, data] = await getCart()

  if (error) {
    return { props: { error: error } }
  }

  const cart = data.result
  const getProduct = getProductService(args)

  if (cart.products.length > 0) {
    const allProducts = await Promise.all(
      cart.products.map(async (product) => {
        const [errorProduct, dataProduct] = await getProduct(product.id)

        if (errorProduct) {
          return { props: { error: errorProduct } }
        }

        return { ...dataProduct.result, quantity: product.quantity }
      })
    )

    return { props: { cart: { ...cart, products: allProducts } } }
  }

  return { props: { cart: cart } }
}

const ProductCart = (props) => {
  const { product } = props
  const [err, setErr] = useState(null)
  const [errQuantity, setErrQuantity] = useState(null)
  const {
    actions: { deleteProductOfCart, updateProductQuantity },
  } = useAppContext()
  const router = useRouter()

  const handleDeleteProduct = useCallback(async () => {
    setErr(null)
    setErrQuantity(null)

    const deletedProduct = await deleteProductOfCart(product.id)

    if (deletedProduct[0]) {
      setErr(deletedProduct[0])
    }

    router.push("/cart")
  }, [deleteProductOfCart, product.id, router])

  const handlePlus = useCallback(async () => {
    setErr(null)
    setErrQuantity(null)

    const updatedProduct = await updateProductQuantity(
      product.id,
      product.quantity + 1
    )

    if (updatedProduct[0]) {
      setErrQuantity(updatedProduct[0])
    }

    router.push("/cart")
  }, [product.id, product.quantity, router, updateProductQuantity])

  const handleMinus = useCallback(async () => {
    setErr(null)
    setErrQuantity(null)

    const updatedProduct = await updateProductQuantity(
      product.id,
      product.quantity - 1
    )

    if (updatedProduct[0]) {
      setErrQuantity(updatedProduct[0])
    }

    router.push("/cart")
  }, [product.id, product.quantity, router, updateProductQuantity])

  const handleGoToProductPage = useCallback(() => {
    router.push(`/products/${product.id}`)
  }, [product.id, router])

  return (
    <div className="flex h-[9rem] sm:h-full">
      <div className="min-w-[150px] h-full sm:min-w-[200px] sm:h-[200px] relative">
        <Image
          fill
          className="object-cover cursor-pointer"
          src={product.product_images[0].url}
          alt={product.name}
          onClick={handleGoToProductPage}
        />
      </div>
      <div className="flex flex-col gap-4 mx-6 min-w-[40%]">
        <div className="w-full text-lg flex justify-between">
          <p
            className="text-my-dark-brown cursor-pointer"
            onClick={handleGoToProductPage}
          >
            {product.name}
          </p>
          <p className="text-my-dark-brown">{product.price} £</p>
        </div>
        <div className="flex gap-6">
          <p className="text-my-dark-brown line-clamp-4 w-[26rem]">
            {product.description}
          </p>
          <div className="flex flex-col items-center w-[6rem] gap-4">
            <div className="flex">
              <button
                disabled={product.quantity <= 1}
                onClick={handleMinus}
                className="border-my-dark-brown border-y border-l rounded-l-full px-2 text-my-dark-brown disabled:text-opacity-25"
              >
                -
              </button>
              <p className="border border-my-dark-brown px-2 text-my-dark-brown">
                {product.quantity}
              </p>
              <button
                disabled={product.quantity >= product.stock}
                className="border-my-dark-brown border-y border-r rounded-r-full px-2 text-my-dark-brown disabled:text-opacity-25"
                onClick={handlePlus}
              >
                +
              </button>
            </div>
            <button onClick={handleDeleteProduct}>
              <Image
                src={icons.removeProductOnBasket}
                alt={"delete"}
                width={50}
                height={50}
              ></Image>
            </button>
          </div>
        </div>
        {err && <ErrorParagraph messageError={t("cart.cantDelete")} />}
        {errQuantity && (
          <ErrorParagraph messageError={t("cart.cantUpdateQuantity")} />
        )}
      </div>
    </div>
  )
}

const AllProducts = (props) => {
  const { products, t } = props

  const compareProductByPrice = (a, b) => {
    return a.price - b.price
  }

  products.sort(compareProductByPrice)

  return (
    <div className="overflow-y-auto bottom-30 lg:bottom-auto mx-2 min-w-screen sm:mx-0 sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[40%] min-h-[10rem] max-h-[30rem] mb-[15vh] sm:mb-0 sm:max-h-[40rem] grid grid-cols-1 gap-4">
      {!products || products.length === 0 ? (
        <p className="text-center text-my-dark-brown">{t("cart.noProduct")}</p>
      ) : (
        products.map((product, index) => (
          <ProductCart key={index} product={product}></ProductCart>
        ))
      )}
    </div>
  )
}

const CartPage = (props) => {
  const { cart, error } = props
  const { t } = useTranslation()
  const router = useRouter()

  const tva = Number((cart.price / 120) * 20).toFixed(2)

  const handlePaymentButton = useCallback(() => {
    if (!cart.user_id) {
      router.push("/login")

      return
    }

    router.push(`user/${cart.user_id}/addresses`)
  }, [cart.user_id, router])

  return (
    <Page title={t("cart.title")}>
      {error ? (
        <ErrorParagraph messageError={t("cart.noCartFound")} />
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-my-dark-brown text-xl font-semibold my-6">
            {t("cart.title")}
          </h1>
          <div className="flex flex-col sm:flex-row-reverse justify-center gap-10">
            <div className="z-10 right-0 bg-my-beige fixed mt-2 lg:mt-10 pb-20 bottom-0 w-full lg:w-auto lg:bottom-auto lg:static flex flex-col lg:gap-8 border-t border-my-dark-brown">
              <div>
                <div className="flex justify-between mx-6 lg:mx-0 text-my-dark-brown ">
                  <p>{t("cart.total")}</p>
                  <p>{cart.price} £</p>
                </div>
                <div className="flex justify-between mx-6 lg:mx-0 text-my-dark-brown text-opacity-75 text-sm">
                  <p>{t("cart.tva")}</p>
                  <p>{tva} £</p>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <MyCustomButton
                  disabled={cart.price <= 0}
                  name={t("cart.payment")}
                  onClick={handlePaymentButton}
                  classNameButton="w-[20rem] mt-2 disabled:opacity-50 rounded-full shadow-lg shadow-slate-400 active:shadow-inner active:shadow-slate-400"
                />
              </div>
            </div>
            <AllProducts products={cart.products} t={t} />
          </div>
        </div>
      )}
    </Page>
  )
}

CartPage.isPublic = true
export default CartPage
