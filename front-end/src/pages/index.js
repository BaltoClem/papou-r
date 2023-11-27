import MyHome from "@/components/Home"
import config from "@/config"
import { createApi } from "@/services/api"
import { getCarouselService } from "@/services/carousel"
import { getCategoriesService } from "@/services/categories"

export const getServerSideProps = async (context) => {
  const api = createApi({ jwt: context.req.cookies.session })
  const getCategories = getCategoriesService({ api })
  const dataCategories = await getCategories(config.api.limitPage, 1)
  const getCarousel = getCarouselService({ api })
  const dataCarousel = await getCarousel()
  const carousel = []
  dataCarousel.result.forEach((image) => {
    carousel.push(image.image_url)
  })

  return {
    props: {
      categories: dataCategories.result.categories,
      totalPages: dataCategories.result.totalPages,
      carousel: carousel,
    },
  }
}

const Home = (props) => {
  return (
    <MyHome
      categories={props.categories}
      carousel={props.carousel}
      totalPages={props.totalPages}
    />
  )
}

Home.isPublic = true
export default Home
