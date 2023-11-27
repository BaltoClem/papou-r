import Page from "@/components/layout/Page"
import useAppContext from "@/hooks/useAppContext"
import MyBackOfficeTable from "@/components/MyBackOfficeTable"
import { useState, useCallback } from "react"
import { useRouter } from "next/router"
import MyCustomButton from "@/components/MyCustomButton"
import { useTranslation } from "react-i18next"
import { createApi } from "@/services/api"
import { getImagesService } from "@/services/images"
import config from "@/config"
import Pagination from "@/components/Pagination"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })

  const getImages = getImagesService({ api })
  const dataImages = await getImages(config.api.limitPage, 1)

  return {
    props: {
      images: dataImages.data.result.images,
      totalPages: dataImages.data.result.totalPages,
    },
  }
}

const List = (props) => {
  const { images, totalPages } = props
  const { t } = useTranslation()
  const {
    actions: { checkIsAdmin, getImages, deleteImage },
  } = useAppContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [thisImagesPage, setThisImagesPage] = useState(images)
  const router = useRouter()
  const myPath = "/back-office/images"

  checkIsAdmin()

  const handlePageChange = useCallback(
    async (page) => {
      const imageData = await getImages(config.api.limitPage, page)

      setThisImagesPage(imageData.data.result.images)
      setCurrentPage(page)
    },
    [getImages]
  )

  const handleNewMaterial = useCallback(() => {
    router.push(`${myPath}/addImage`)
  }, [router])

  const imagesHeaders = ["id", "slug", "url"]

  return (
    <Page>
      <h1 className="flex place-content-center font-black text-xl">
        {t("back-office.images.title")}
      </h1>
      <MyCustomButton
        name={t("back-office.images.add")}
        onClick={handleNewMaterial}
      ></MyCustomButton>
      <MyBackOfficeTable
        headers={imagesHeaders}
        data={thisImagesPage}
        path={myPath}
        onDelete={deleteImage}
        canUpdate={true}
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
