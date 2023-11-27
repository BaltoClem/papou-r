import Page from "@/components/layout/Page"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import MyCustomButton from "@/components/MyCustomButton"
import { useTranslation } from "react-i18next"
import useAppContext from "@/hooks/useAppContext"
import { createApi } from "@/services/api"
import errorHandler from "@/utils/errorHandler"
import { getProductsService } from "@/services/products"
import config from "@/config"
import Pagination from "@/components/Pagination"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getProducts = getProductsService(args)

  const productData = await getProducts(config.api.limitPage, 1)

  return {
    props: {
      products: productData.data.result.products,
      totalPages: productData.data.result.totalPages,
    },
  }
}

const List = (props) => {
  const { products, totalPages } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, getProducts, deleteProduct },
  } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [thisProductsPage, setThisProductsPage] = useState(products)
  const router = useRouter()
  const myPath = "/back-office/products"

  checkIsAdmin()

  const handlePageChange = useCallback(
    async (page) => {
      const data = await getProducts(config.api.limitPage, page)

      setThisProductsPage(data.result.products)
      setCurrentPage(page)
    },
    [getProducts]
  )

  const handleNewProduct = useCallback(() => {
    router.push(`${myPath}/addProduct`)
  }, [router])

  const productsHeaders = [
    "id",
    "name",
    "price",
    "description",
    "stock",
    "dimension_id",
    "deleted",
    "createdAt",
    "updatedAt",
  ]

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.addProduct.title")}
      </h1>
      <MyCustomButton
        name={t("back-office.addProduct.addAProductLabel")}
        onClick={handleNewProduct}
      ></MyCustomButton>

      <MyBackOfficeTable
        headers={productsHeaders}
        data={thisProductsPage}
        path={myPath}
        onDelete={deleteProduct}
      />
      <Pagination
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </Page>
  )
}

List.isPublic = false
export default List
