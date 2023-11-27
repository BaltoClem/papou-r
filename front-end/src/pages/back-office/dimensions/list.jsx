import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import MyCustomButton from "@/components/MyCustomButton"
import { useTranslation } from "react-i18next"
import { createApi } from "@/services/api"
import { getDimensionsService } from "@/services/dimensions"
import config from "@/config"
import Pagination from "@/components/Pagination"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })
  const getDimensions = getDimensionsService({ api })

  const dataDimensions = await getDimensions(config.api.limitPage, 1)

  return {
    props: {
      dimensions: dataDimensions.data.result.dimensions,
      totalPages: dataDimensions.data.result.totalPages,
    },
  }
}

const List = (props) => {
  const { dimensions, totalPages } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, getDimensions, deleteDimensions },
  } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [thisDimensionsPage, setThisDimensionsPage] = useState(dimensions)

  const router = useRouter()
  const myPath = "/back-office/dimensions"

  checkIsAdmin()

  const handleNewDimension = useCallback(() => {
    router.push(`${myPath}/addDimension`)
  }, [router])

  const handlePageChange = useCallback(
    async (page) => {
      const data = await getDimensions(config.api.limitPage, page)

      setThisDimensionsPage(data.result.dimensions)
      setCurrentPage(page)
    },
    [getDimensions]
  )

  const dimensionsHeaders = [
    "id",
    "width",
    "height",
    "length",
    "createdAt",
    "updatedAt",
  ]

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.dimensions.title")}
      </h1>
      <MyCustomButton
        name={t("back-office.dimensions.add")}
        onClick={handleNewDimension}
      ></MyCustomButton>
      <MyBackOfficeTable
        headers={dimensionsHeaders}
        data={thisDimensionsPage}
        path={myPath}
        onDelete={deleteDimensions}
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
