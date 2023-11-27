import Image from "next/image"
import { useRouter } from "next/router"
import Carousel from "./Carousel"
import MyCustomButton from "./MyCustomButton"
import { useCallback, useState } from "react"
import Page from "./layout/Page"
import { useTranslation } from "react-i18next"
import Pagination from "./Pagination"
import useAppContext from "@/hooks/useAppContext"
import config from "@/config"

const Category = (props) => {
  const { name, img, handleClickCategory, categoryId } = props

  return (
    <div className="flex flex-col items-center">
      <div className="h-[200px] w-full sm:h-[250px] sm:w-[300px] sm:min-w-[200px] lg:h-[300px] lg:w-[350px] relative">
        <Image
          src={img}
          alt={img}
          fill
          className="bg-my-brown object-cover"
        ></Image>
      </div>
      <MyCustomButton
        name={name}
        onClick={handleClickCategory}
        data-category-id={categoryId}
        classNameButton="w-[60%] lg:w-[50%] mt-2 rounded-full shadow-lg shadow-slate-400 active:shadow-inner active:shadow-slate-400"
      />
    </div>
  )
}

const Home = (props) => {
  const { categories, totalPages, carousel } = props
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()
  const {
    actions: { getCategories },
  } = useAppContext()
  const [thisCategoriesPage, setThisCategoriesPage] = useState(categories)

  const router = useRouter()

  const handleClickCategory = useCallback(
    (event) => {
      const categoryId = Number.parseInt(
        event.currentTarget.getAttribute("data-category-id"),
        10
      )
      router.push(`/categories/${categoryId}`)
    },
    [router]
  )

  const handlePageChange = useCallback(
    async (page) => {
      const data = await getCategories(config.api.limitPage, page)

      setThisCategoriesPage(data.result.categories)
      setCurrentPage(page)
    },
    [getCategories]
  )

  return (
    <Page>
      <Carousel
        imageDefault="https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table3.png"
        images={carousel}
        className="w-full h-[250px] sm:h-[450px] lg:h-[600px]"
      ></Carousel>
      <div className="bg-my-dark-brown w-full h-3 absolute"></div>
      <p className="text-center w-full mt-4 sm:mt-8 text-lg sm:text-2xl">
        {t("home.slogan")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-[15%] sm:mb-[2%] lg:mb-[4%] mt-4 sm:mt-8 mx-2">
        {thisCategoriesPage &&
          thisCategoriesPage.map((category, index) => (
            <Category
              key={index}
              name={category.name}
              img={category.image_url}
              handleClickCategory={handleClickCategory}
              categoryId={category.id}
            ></Category>
          ))}
      </div>
      <Pagination
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
      />
    </Page>
  )
}

export default Home
