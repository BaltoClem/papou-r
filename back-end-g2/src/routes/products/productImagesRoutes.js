import {
  internalError,
  notFoundError,
  alreadyExistsError,
} from "../../../helpers/reponseHelpers.js"
import ImageModel from "../../db/models/ImageModel.js"
import ProductImagesModel from "../../db/models/ProductImagesModel.js"
import ProductModel from "../../db/models/ProductModel.js"
import { adminAuth } from "../../middleware/auth.js"
import validate from "../../middleware/validate.js"
import { arrayValidator } from "../../validators.js"

const productImagesRoutes = ({ app }) => {
  app.get("/product/:productId/images", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = ProductModel.query()
      .withGraphFetched("product_images")
      .findById(req.params.productId)

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record.product_images })
  })

  app.patch(
    "/product/:productId/images",
    adminAuth,
    validate({ body: { imageIds: arrayValidator.required() } }),
    async (req, res) => {
      const { productId } = req.params

      const product = await ProductModel.query()
        .withGraphFetched("product_images")
        .findById(productId)

      if (!product) {
        notFoundError(res)

        return
      }

      const { imageIds } = req.locals.body

      const filteredImagesId = [...new Set(imageIds)]

      const images = await ImageModel.query().whereIn("id", filteredImagesId)

      if (!images.length === filteredImagesId.length) {
        notFoundError(res, "E.IMAGE_NOT_FOUND")

        return
      }

      if (
        product.product_images.some(({ id }) => filteredImagesId.includes(id))
      ) {
        alreadyExistsError(res)

        return
      }

      const productsImages = filteredImagesId.map((id) => ({
        product_id: productId,
        image_id: id,
      }))

      await ProductImagesModel.query().insert(productsImages).returning("*")

      const resultProduct = await ProductModel.query()
        .withGraphFetched("product_images")
        .findById(productId)

      res.send({ result: resultProduct })
    }
  )

  app.delete(
    "/product/:productId/images/:imageId",
    adminAuth,
    async (req, res) => {
      const { productId, imageId } = req.params

      const product = await ProductModel.query()
        .withGraphFetched("product_images")
        .findById(productId)

      if (!product) {
        notFoundError(res)

        return
      }

      if (product.product_images.length === 0) {
        internalError(res, "E.PRODUCT.NO_IMAGES")

        return
      }

      const image = await ImageModel.query().where({ id: imageId })

      if (!image) {
        notFoundError(res, "E.PRODUCT.IMAGES_NOT_FOUND")

        return
      }

      await ProductImagesModel.query()
        .where({ product_id: productId })
        .where({ image_id: imageId })
        .delete()

      res.send({ result: "OK" })
    }
  )
}

export default productImagesRoutes
