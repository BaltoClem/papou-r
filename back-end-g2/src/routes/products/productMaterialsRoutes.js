import { getProduct } from "../../../helpers/getterHelpers.js"
import {
  internalError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import MaterialModel from "../../db/models/MaterialModel.js"
import ProductMaterialsModel from "../../db/models/ProductMaterialsModel.js"
import ProductModel from "../../db/models/ProductModel.js"
import { adminAuth } from "../../middleware/auth.js"
import validate from "../../middleware/validate.js"
import { arrayValidator } from "../../validators.js"

const productMaterialsRoutes = ({ app }) => {
  app.get("/product/:productId/materials", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = ProductModel.query()
      .withGraphFetched("product_materials")
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
    "/product/:productId/materials",
    adminAuth,
    validate({ body: { materialIds: arrayValidator.required() } }),
    async (req, res) => {
      const { productId } = req.params
      const { materialIds } = req.locals.body
      const product = await getProduct(productId, res)

      if (!product) {
        notFoundError(res)

        return
      }

      const filteredmaterialsId = [...new Set(materialIds)]

      const materials = await MaterialModel.query().whereIn(
        "id",
        filteredmaterialsId
      )

      if (materials.length !== filteredmaterialsId.length) {
        notFoundError(res, "E.PRODUCT.MATERIAL_NOT_FOUND")

        return
      }

      await ProductModel.relatedQuery("product_materials")
        .for(productId)
        .unrelate()

      for (const i in materialIds) {
        await ProductModel.relatedQuery("product_materials")
          .for(productId)
          .relate(materialIds[i])
      }
      const resultProduct = await ProductModel.query()
        .withGraphFetched("product_materials")
        .findById(productId)

      res.send({ result: resultProduct.product_materials })
    }
  )

  app.delete(
    "/product/:productId/materials/:materialId",
    adminAuth,
    async (req, res) => {
      const { productId, materialId } = req.params

      const product = await ProductModel.query()
        .withGraphFetched("product_materials")
        .findById(productId)

      if (!product) {
        notFoundError(res)

        return
      }

      if (product.product_materials.length === 0) {
        internalError(res, "E.PRODUCT.NO_MATERIALS")

        return
      }

      const material = await MaterialModel.query().findById(materialId)

      if (!material) {
        notFoundError(res, "E.PRODUCT.MATERIALS_NOT_FOUND")

        return
      }

      await ProductMaterialsModel.query()
        .where({ product_id: productId })
        .where({ material_id: materialId })
        .delete()

      res.send({ result: "OK" })
    }
  )
}

export default productMaterialsRoutes
