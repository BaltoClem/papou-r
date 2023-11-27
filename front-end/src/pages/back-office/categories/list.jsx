import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import MyCustomButton from "@/components/MyCustomButton"
import { useTranslation } from "react-i18next"
import { getCategoriesService } from "@/services/categories"
import { createApi } from "@/services/api"
import config from "@/config"
import Pagination from "@/components/Pagination"
import ErrorParagraph from "@/components/Error"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })

  const getCategories = getCategoriesService({ api })
  const dataCategories = await getCategories(config.api.limitPage, 1)

  return {
    props: {
      categories: dataCategories.result.categories,
      totalPages: dataCategories.result.totalPages,
    },
  }
}

const List = (props) => {
  const { error, categories, totalPages } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, getCategories, deleteCategory },
  } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [thisCategoriesPage, setThisCategoriesPage] = useState(categories)
  const router = useRouter()
  const myPath = "/back-office/categories"

  checkIsAdmin()

  const handlePageChange = useCallback(
    async (page) => {
      const data = await getCategories(config.api.limitPage, page)

      setThisCategoriesPage(data.result.categories)
      setCurrentPage(page)
    },
    [getCategories]
  )

  const handleNewCategory = useCallback(() => {
    router.push(`${myPath}/addCategory`)
  }, [router])

  const categoriesHeaders = [
    "id",
    "name",
    "slug",
    "image_url",
    "description",
    "createdAt",
    "updatedAt",
  ]

  return (
    <Page>
      {error ? (
        <ErrorParagraph messageError={t("category.noCategoriesFound")} />
      ) : (
        <div>
          <h1 className="flex place-content-center font-black text-xl">
            {t("back-office.categories.title")}
          </h1>
          <MyCustomButton
            name={t("back-office.categories.add")}
            onClick={handleNewCategory}
          ></MyCustomButton>
          {thisCategoriesPage ? (
            <MyBackOfficeTable
              headers={categoriesHeaders}
              data={thisCategoriesPage}
              path={myPath}
              onDelete={deleteCategory}
            />
          ) : (
            <></>
          )}

          <Pagination
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      )}
    </Page>
  )
}

List.isPublic = false
export default List
