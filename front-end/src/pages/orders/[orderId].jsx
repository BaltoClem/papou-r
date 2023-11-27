import Page from "@/components/layout/Page"
import { getAddressService } from "@/services/addresses"
import { createApi } from "@/services/api"
import { getCartService } from "@/services/cart"
import { getOrderService } from "@/services/orders"
import { getProductService } from "@/services/products"
import errorHandler from "@/utils/errorHandler"
import Image from "next/image"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

export const getServerSideProps = async (context) => {
  const { orderId } = context.params
  const api = createApi({
    jwt: context.req.cookies.session,
  })

  const args = { api, errorHandler }
  const getOrder = getOrderService(args)
  const [error, data] = await getOrder(orderId)

  if (error) {
    return { props: { error: error } }
  }

  const getAddress = getAddressService(args)
  const [errorAddress, dataAddress] = await getAddress(data.result.address_id)

  if (errorAddress) {
    return {
      props: {
        error: errorCart,
        order: { ...data.result, products: [] },
      },
    }
  }

  const address = dataAddress.result

  const getCart = getCartService(args)
  const [errorCart, dataCart] = await getCart(data.result.cart_id)

  if (errorCart) {
    return {
      props: {
        error: errorCart,
        order: { ...data.result, products: [], address: address },
      },
    }
  }

  const cart = dataCart.result
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

    return {
      props: {
        order: { ...data.result, products: allProducts, address: address },
      },
    }
  }

  return {
    props: {
      order: {
        ...data.result,
        products: dataCart.result.products,
        address: address,
      },
    },
  }
}

const ProductOrder = (props) => {
  const { product } = props
  const router = useRouter()

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
          <p>x{product.quantity}</p>
        </div>
      </div>
    </div>
  )
}

const OrderPage = (props) => {
  const { order } = props
  const { t } = useTranslation()

  const tva = Number((order.amount / 120) * 20).toFixed(2)

  const getLabelAddress = (address) =>
    `${address.fullname}\n${address.street_name}\n${address.city} ${
      address.zipcode
    }\n${address.country}${address.complement ? `\n${address.complement}` : ""}`

  return (
    <Page title={t("order.title", { orderId: order.id })}>
      <div className="flex flex-col items-center">
        <h1 className="text-my-dark-brown text-xl font-semibold my-6">
          {t("order.title", { orderId: order.id })}
        </h1>
        <div className="flex flex-col sm:flex-row-reverse justify-center gap-10">
          <div className="z-10 right-0 bg-my-beige fixed mt-2 lg:mt-10 pb-20 bottom-0 w-full lg:w-auto lg:bottom-auto lg:static flex flex-col lg:gap-8">
            <p className="text-my-dark-brown text-center font-semibold text-lg">
              {order.status}
            </p>
            <div className="border-t border-my-dark-brown">
              <div className="flex justify-between mx-6 lg:mx-0 text-my-dark-brown">
                <p>{t("cart.total")}</p>
                <p>{order.amount} £</p>
              </div>
              <div className="flex justify-between mx-6 lg:mx-0 text-my-dark-brown text-opacity-75 text-sm">
                <p>{t("cart.tva")}</p>
                <p>{tva} £</p>
              </div>
            </div>
            <div className="border-t border-my-dark-brown">
              <p className="text-my-dark-brown mx-6 lg:mx-0">
                {t("order.address")}
              </p>
              <span className="whitespace-pre-wrap mx-6 lg:mx-0 text-my-dark-brown text-opacity-75 text-sm">
                {getLabelAddress(order.address)}
              </span>
            </div>
          </div>
          <div className="overflow-y-auto bottom-60 lg:bottom-auto mx-2 min-w-screen sm:mx-0 lg:w-[60%] xl:w-[40%] min-h-[10rem] max-h-[30rem] mb-[15vh] sm:mb-0 sm:max-h-[40rem] grid grid-cols-1 gap-4">
            {order.products &&
              order.products.length > 0 &&
              order.products.map((product, index) => (
                <ProductOrder key={index} product={product} />
              ))}
          </div>
        </div>
      </div>
    </Page>
  )
}

OrderPage.isPublic = true
export default OrderPage
