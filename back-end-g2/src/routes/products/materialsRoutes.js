import MaterialModel from "../../db/models/MaterialModel.js"
import validate from "../../middleware/validate.js"
import { idValidator, materialNameValidator } from "../../validators.js"
import {
  alreadyExistsError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { adminAuth } from "../../middleware/auth.js"
import ProductMaterialsModel from "../../db/models/ProductMaterialsModel.js"
import { totalPages } from "../../../helpers/getterHelpers.js"

const materialsRoutes = ({ app }) => {
  app.get("/material", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = MaterialModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const materials = await query
    const total = totalPages(materials.length, limit)

    const record = await query.modify("paginate", limit, page)

    res.send({ result: { materials: record, totalPages: total } })
  })

  app.get(
    "/material/:materialId",
    validate({ req: { params: { materialId: idValidator } } }),
    async (req, res) => {
      const materialId = req.params.materialId
      const material = await MaterialModel.query().findOne({ id: materialId })

      if (!material) {
        notFoundError(res)

        return
      }

      res.send({ result: material })
    }
  )

  app.post(
    "/material",
    adminAuth,
    validate({
      body: {
        name: materialNameValidator,
      },
    }),
    async (req, res) => {
      const { name } = req.locals.body

      const material = await MaterialModel.query().findOne({
        name: name,
      })

      if (material) {
        alreadyExistsError(res)

        return
      }

      const newMaterial = await MaterialModel.query()
        .insertAndFetch({
          name: name,
        })
        .returning("*")

      res.status(201).send({ result: newMaterial })
    }
  )

  app.patch(
    "/material/:materialId",
    adminAuth,
    validate({
      body: {
        name: materialNameValidator,
      },
      params: { materialId: idValidator },
    }),
    async (req, res) => {
      const {
        params: { materialId },
        body: { name },
      } = req
      const query = MaterialModel.query().findOne({
        id: materialId,
      })
      const material = await query

      if (!material) {
        notFoundError(res)

        return
      }

      const updatedMaterial = await query
        .update({
          ...(name ? { name } : {}),
        })
        .returning("*")

      res.send({
        result: updatedMaterial,
      })
    }
  )

  app.delete(
    "/material/:materialId",
    adminAuth,
    validate({ req: { params: { materialId: idValidator.required() } } }),
    async (req, res) => {
      const materialId = req.params.materialId

      const query = MaterialModel.query().findById(materialId)
      const material = await query

      if (!material) {
        notFoundError(res)

        return
      }

      const productMaterials = await query.withGraphFetched("product_materials")

      if (productMaterials.product_materials.length > 0) {
        await ProductMaterialsModel.query()
          .where({ material_id: materialId })
          .delete()
      }

      await query.delete()

      res.send({ result: "OK" })
    }
  )
}

export default materialsRoutes
