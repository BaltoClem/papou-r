import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import MyCustomButton from "@/components/MyCustomButton"
import { useTranslation } from "react-i18next"
import { createApi } from "@/services/api"
import { getMaterialsService } from "@/services/materials"
import config from "@/config"
import Pagination from "@/components/Pagination"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.sessions })

  const getMaterials = getMaterialsService({ api })

  const materailsData = await getMaterials(config.api.limitPage, 1)

  return {
    props: {
      materials: materailsData.data.result.materials,
      totalPages: materailsData.data.result.totalPages,
    },
  }
}

const List = (props) => {
  const { materials, totalPages } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, getMaterials, deleteMaterial },
  } = useAppContext()
  const [thisMaterialPage, setThisMaterialPage] = useState(materials)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()
  const myPath = "/back-office/materials"

  checkIsAdmin()

  const handlePageChange = useCallback(
    async (page) => {
      const materialData = await getMaterials(config.api.limitPage, page)

      setThisMaterialPage(materialData.data.result.categories)
      setCurrentPage(page)
    },
    [getMaterials]
  )

  const handleNewMaterial = useCallback(() => {
    router.push(`${myPath}/addMaterial`)
  }, [router])

  const materialsHeaders = ["id", "name", "createdAt", "updatedAt"]

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.materials.title")}
      </h1>
      <MyCustomButton
        name={t("back-office.materials.add")}
        onClick={handleNewMaterial}
      ></MyCustomButton>

      <MyBackOfficeTable
        headers={materialsHeaders}
        data={thisMaterialPage}
        path={myPath}
        onDelete={deleteMaterial}
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
