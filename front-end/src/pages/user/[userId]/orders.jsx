import ErrorParagraph from "@/components/Error"
import Page from "@/components/layout/Page"
import { createApi } from "@/services/api"
import { getUserService } from "@/services/users"
import errorHandler from "@/utils/errorHandler"
import { useRouter } from "next/router"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

export const getServerSideProps = async (context) => {
  const { userId } = context.params

  const api = createApi({
    jwt: context.req.cookies.session,
  })

  const args = { api, errorHandler }
  const getUser = getUserService(args)
  const [error, data] = await getUser(userId)

  if (error) {
    return { props: { error: error } }
  }

  return { props: { orders: data.result.orders, userId: userId } }
}

const getYear = (date) => date.slice(0, 4)

const Order = (props) => {
  const { order } = props
  const { t } = useTranslation()
  const router = useRouter()

  const handleClick = useCallback(
    () => router.push(`/orders/${order.id}`),
    [order.id, router]
  )

  return (
    <div className="mb-8 text-lg cursor-pointer" onClick={handleClick}>
      <div className="flex justify-between w-full gap-6 sm:w-[60vh] md:w-[80vh] lg:w-[100vh]">
        <p>
          <span className="underline">{order.createdAt.slice(0, 10)}</span>
          {` - ${t("orders.numberOrder") + order.id}`}
        </p>
        <p>{order.status}</p>
      </div>
      <div className="flex justify-between w-full gap-6 sm:w-[60vh] md:w-[80vh] lg:w-[100vh]">
        <p>{`${order.itemsQuantities} ${t("orders.articles")}`}</p>
        <p>{order.amount} £</p>
      </div>
    </div>
  )
}

const YearCategoryOrder = (props) => {
  const { ordersYear, year } = props

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-2xl">{year}</p>
      <div className="bg-my-dark-brown w-full h-px" />
      <div>
        {ordersYear &&
          ordersYear.length > 0 &&
          ordersYear.map((order, index) => <Order order={order} key={index} />)}
      </div>
    </div>
  )
}

const OrdersPage = (props) => {
  const { error, orders } = props
  const { t } = useTranslation()

  const ordersGroupByYear = orders.reduce((group, order) => {
    const { createdAt } = order
    const year = getYear(createdAt)
    group[year] = group[year] ?? []
    group[year].push(order)

    return group
  }, {})

  const keys = ordersGroupByYear ? Object.keys(ordersGroupByYear).reverse() : []

  return (
    <Page title={t("orders.title")}>
      <h1 className="flex place-content-center text-my-dark-brown font-semibold text-xl my-10">
        {t("orders.title")}
      </h1>
      {error && <ErrorParagraph messageError={t(error)} />}
      <div className="text-my-dark-brown">
        {keys &&
          keys.length > 0 &&
          keys.map((year, index) => (
            <YearCategoryOrder
              ordersYear={ordersGroupByYear[year]}
              key={index}
              year={year}
            />
          ))}
      </div>
    </Page>
  )
}

OrdersPage.isPublic = true
export default OrdersPage
