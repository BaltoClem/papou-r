import CategoryModel from "../../db/models/CategoryModel.js"
import { arrayValidator } from "../../validators.js"
import validate from "../../middleware/validate.js"
import { notFoundError } from "../../../helpers/reponseHelpers.js"
import { adminAuth } from "../../middleware/auth.js"

import ProductModel from "../../db/models/ProductModel.js"

const productCategoriesRoutes = ({ app }) => {
  app.get("/product/:productId/categories", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = ProductModel.query()
      .withGraphFetched("product_categories")
      .findById(req.params.productId)

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record })
  })

  app.patch(
    "/product/:productId/categories",
    adminAuth,
    validate({
      body: {
        categoriesId: arrayValidator,
      },
    }),
    async (req, res) => {
      const {
        body: { categoriesId },
      } = req.locals
      const { productId } = req.params

      const product = await ProductModel.query()
        .withGraphFetched("product_categories")
        .findById(productId)

      if (!product) {
        notFoundError(res)

        return
      }

      const filteredcategoriesId = [...new Set(categoriesId)]

      const categories = await CategoryModel.query().whereIn(
        "id",
        filteredcategoriesId
      )

      if (categories.length !== filteredcategoriesId.length) {
        notFoundError(res, "E.PRODUCT.CATEGORY_NOT_FOUND")

        return
      }

      await ProductModel.relatedQuery("product_categories")
        .for(productId)
        .unrelate()

      for (const i in categoriesId) {
        await ProductModel.relatedQuery("product_categories")
          .for(productId)
          .relate(categoriesId[i])
      }

      const resultProduct = await ProductModel.query()
        .withGraphFetched("product_categories")
        .findById(productId)

      res.send({ result: resultProduct })
    }
  )
}

export default productCategoriesRoutes
