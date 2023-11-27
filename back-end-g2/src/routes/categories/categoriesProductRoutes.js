import CategoryModel from "../../db/models/CategoryModel.js"
import { arrayValidator, idValidator } from "../../validators.js"
import validate from "../../middleware/validate.js"
import {
  alreadyExistsError,
  internalError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { adminAuth } from "../../middleware/auth.js"
import ProductCategoriesModel from "../../db/models/ProductCategoriesModel.js"
import ProductModel from "../../db/models/ProductModel.js"

const categoriesProductRoutes = ({ app }) => {
  app.get("/category/:categoryId/products", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = CategoryModel.query()
      .withGraphFetched("products")
      .findById(req.params.categoryId)

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record.products })
  })

  app.patch(
    "/category/:categoryId/products",
    adminAuth,
    validate({
      body: {
        productsId: arrayValidator,
      },
    }),
    async (req, res) => {
      const {
        body: { productsId },
      } = req.locals
      const { categoryId } = req.params

      const category = await CategoryModel.query()
        .withGraphFetched("products")
        .findById(categoryId)

      if (!category) {
        notFoundError(res)

        return
      }

      const filteredProductsId = [...new Set(productsId)]

      if (category.products.some(({ id }) => filteredProductsId.includes(id))) {
        alreadyExistsError(res)

        return
      }

      const products = await ProductModel.query().whereIn(
        "id",
        filteredProductsId
      )

      if (!products.length === filteredProductsId.length) {
        notFoundError(res, "E.CATEGORY.PRODUCT_NOT_FOUND")

        return
      }

      const categoryProducts = filteredProductsId.map((id) => ({
        category_id: categoryId,
        product_id: id,
      }))

      await ProductCategoriesModel.query()
        .insert(categoryProducts)
        .returning("*")

      const resultCategory = await CategoryModel.query()
        .withGraphFetched("products")
        .findById(categoryId)

      res.send({ result: resultCategory.products })
    }
  )

  app.delete(
    "/category/:categoryId/products",
    adminAuth,
    validate({ params: { categoryId: idValidator.required() } }),
    async (req, res) => {
      const { categoryId } = req.params
      const {
        body: { productsId },
      } = req.locals

      const category = await CategoryModel.query()
        .withGraphFetched("products")
        .findById(categoryId)

      if (!category) {
        notFoundError(res)

        return
      }

      if (category.products.length === 0) {
        internalError(res, "E.CATEGORY.NO_PRODUCTS")

        return
      }

      const filteredproductsId = [...new Set(productsId)]

      const products = await ProductModel.query().whereIn(
        "id",
        filteredproductsId
      )

      if (products.length !== filteredproductsId.length) {
        notFoundError(res, "E.CATEGORY.PRODUCT_NOT_FOUND")

        return
      }

      await ProductCategoriesModel.query()
        .where({ category_id: categoryId })
        .whereIn("product_id", filteredproductsId)
        .delete()

      res.send({ result: "OK" })
    }
  )
}

export default categoriesProductRoutes
