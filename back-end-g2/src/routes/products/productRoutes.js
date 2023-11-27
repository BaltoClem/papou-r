import ProductModel from "../../db/models/ProductModel.js"
import validate from "../../middleware/validate.js"
import {
  positiveIntegerValidator,
  priceValidator,
  stockValidator,
  stringValidator,
  productNameValidator,
  maxPriceValidator,
  booleanValidator,
  sortByValidator,
  sortOrderValidator,
} from "../../validators.js"
import { adminAuth } from "../../middleware/auth.js"
import { notFoundError } from "../../../helpers/reponseHelpers.js"
import ProductCategoriesModel from "../../db/models/ProductCategoriesModel.js"
import ProductImagesModel from "../../db/models/ProductImagesModel.js"
import {
  getRelatedProducts,
  totalPages,
} from "../../../helpers/getterHelpers.js"

const productRoutes = ({ app }) => {
  app.post(
    "/product",
    adminAuth,
    validate({
      body: {
        name: productNameValidator.required("E.MISSING.product_name"),
        description: stringValidator.required(),
        price: priceValidator.required("E.MISSING.price"),
        stock: stockValidator.required("E.MISSING.stock"),
        dimension_id: positiveIntegerValidator.required(),
      },
    }),
    async (req, res) => {
      const { name, description, price, stock, dimension_id } = req.body

      const product = await ProductModel.query()
        .insertAndFetch({
          name: name,
          price: price,
          stock: stock,
          description: description,
          dimension_id: dimension_id,
        })
        .returning("*")

      res.status(201).send({
        result: { product },
      })
    }
  )

  app.patch(
    "/product/:productId",
    adminAuth,
    validate({
      body: {
        name: productNameValidator,
        description: stringValidator,
        price: priceValidator,
        stock: stockValidator,
        dimension_id: positiveIntegerValidator,
      },
    }),
    async (req, res) => {
      const {
        params: { productId },
        body: { name, description, price, stock, dimension_id },
      } = req

      const product = await ProductModel.query().findOne({
        id: productId,
      })

      if (!product) {
        notFoundError(res)

        return
      }

      const updatedProduct = await ProductModel.query()
        .update({
          ...(name ? { name } : {}),
          ...(price ? { price } : {}),
          ...(description ? { description } : {}),
          ...(stock ? { stock } : {}),
          ...(dimension_id ? { dimension_id } : {}),
        })
        .findOne({
          id: productId,
        })
        .returning("*")

      res.status(200).send({ result: updatedProduct })
    }
  )

  app.get(
    "/product",
    validate({
      query: {
        searchText: stringValidator,
        minPrice: positiveIntegerValidator,
        maxPrice: maxPriceValidator("minPrice"),
        inStockOnly: booleanValidator,
        sortBy: sortByValidator,
        sortOrder: sortOrderValidator,
        limit: positiveIntegerValidator,
        page: positiveIntegerValidator,
      },
    }),
    async (req, res) => {
      const {
        limit,
        page,
        searchText,
        minPrice,
        maxPrice,
        inStockOnly,
        sortBy,
        sortOrder,
      } = req.query

      const query = ProductModel.query()

      if (searchText) {
        query.where((builder) => {
          builder
            .where("name", "ILIKE", `%${searchText}%`)
            .orWhere("description", "ILIKE", `%${searchText}%`)
        })
      }

      if (minPrice) {
        query.where("price", ">=", minPrice)
      }

      if (maxPrice) {
        query.where("price", "<=", maxPrice)
      }

      if (inStockOnly === "true") {
        query.where("stock", ">", 0)
      }

      if (sortBy && sortOrder) {
        const order = sortOrder === "asc" ? "asc" : "desc"
        query.orderBy(sortBy, order)
      }

      query.modify("paginate", limit, page)

      const record = await query
      const total = totalPages(record.length, limit)

      res.send({ result: { products: record, totalPages: total } })
    }
  )

  app.get("/product/:productId", async (req, res) => {
    const {
      params: { productId },
    } = req
    const product = await ProductModel.query()
      .findById(productId)
      .withGraphFetched(
        "[product_images, product_materials, product_categories]"
      )

    if (!product) {
      notFoundError(res)

      return
    }

    const relatedProducts = await getRelatedProducts(product)

    res.send({ result: { ...product, related_products: relatedProducts } })
  })

  app.delete("/product/:productId", adminAuth, async (req, res) => {
    const {
      params: { productId },
    } = req
    const query = ProductModel.query().findOne({
      id: productId,
    })

    const product = await query

    if (!product) {
      notFoundError(res)

      return
    }

    await ProductCategoriesModel.query()
      .where({ product_id: productId })
      .delete()

    await ProductImagesModel.query().where({ product_id: productId }).delete()

    await query.update({ ...product, deleted: true }).select("deleted")

    res.send({
      result: "OK",
    })
  })
}

export default productRoutes
