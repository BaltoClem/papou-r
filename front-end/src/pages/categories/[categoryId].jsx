import ErrorParagraph from "@/components/Error"
import Page from "@/components/layout/Page"
import Product from "@/components/Product"
import { createApi } from "@/services/api"
import { getCategoryService } from "@/services/categories"
import { getProductService } from "@/services/products"
import errorHandler from "@/utils/errorHandler"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export const getServerSideProps = async (context) => {
  const { categoryId } = context.params
  const api = createApi({ jwt: context.req.cookies.session })
  const args = { api, errorHandler }

  const getCategory = getCategoryService(args)
  const [errorCategory, dataCategory] = await getCategory(categoryId)

  if (errorCategory) {
    return {
      props: { error: errorCategory },
    }
  }

  const getProduct = getProductService(args)
  let productsWithImages = []
  for (const product of dataCategory.result.products) {
    const [errorProduct, dataProduct] = await getProduct(product.id)

    if (errorProduct) {
      return {
        props: { error: errorProduct },
      }
    }

    productsWithImages.push(dataProduct.result)
  }

  return {
    props: {
      category: dataCategory.result,
      products: productsWithImages,
    },
  }
}

const CategoryPage = (props) => {
  const { error, category, products } = props
  const { t } = useTranslation()

  return (
    <Page>
      {error ? (
        <ErrorParagraph
          messageError={t("category.noCategoryFound", {
            categoryId: category.id.toString(),
          })}
        />
      ) : (
        <div>
          <section className="relative">
            <div className="w-full h-[250px] sm:h-[450px] lg:h-[600px]">
              <Image
                src={category.image_url}
                alt={category.image_url}
                fill
                className="object-cover"
              />
              <div className="bg-my-dark-brown w-full h-3 absolute bottom-0"></div>
            </div>
          </section>
          <p className="text-center w-full mt-4 sm:mt-8 text-lg sm:text-2xl">
            {category.description}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-[15%] sm:mb-[2%] lg:mb-[4%] mt-4 sm:mt-8 mx-2">
            {products &&
              products.map((product, index) => (
                <Product
                  key={index}
                  name={product.name}
                  price={product.price}
                  img={product.product_images[0].url}
                  productId={product.id}
                ></Product>
              ))}
          </div>
        </div>
      )}
    </Page>
  )
}

CategoryPage.isPublic = true
export default CategoryPage
