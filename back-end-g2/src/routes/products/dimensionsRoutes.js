import { ref } from "objection"
import validate from "../../middleware/validate.js"
import {
  idValidator,
  heightValidator,
  widthValidator,
  lengthValidator,
} from "../../validators.js"
import {
  alreadyExistsError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { adminAuth } from "../../middleware/auth.js"
import DimensionModel from "../../db/models/DimensionModel.js"
import ProductModel from "../../db/models/ProductModel.js"
import { totalPages } from "../../../helpers/getterHelpers.js"

const dimensionsRoutes = ({ app }) => {
  app.get("/dimension", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = DimensionModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const dimensions = await query
    const total = totalPages(dimensions.length, limit)

    const record = await query.modify("paginate", limit, page)

    res.send({ result: { dimensions: record, totalPages: total } })
  })

  app.get(
    "/dimension/:dimensionId",
    validate({ req: { params: { dimensionId: idValidator.required() } } }),
    async (req, res) => {
      const dimensionId = req.params.dimensionId
      const dimension = await DimensionModel.query().findById(dimensionId)

      if (!dimension) {
        notFoundError(res)

        return
      }

      res.send({ result: dimension })
    }
  )

  app.post(
    "/dimension",
    adminAuth,
    validate({
      body: {
        height: heightValidator,
        width: widthValidator,
        length: lengthValidator,
      },
    }),
    async (req, res) => {
      const { height, width, length } = req.body
      const dimension = await DimensionModel.query().findOne({
        height: height,
        width: width,
        length: length,
      })

      if (dimension) {
        alreadyExistsError(res)

        return
      }

      const newDimension = await DimensionModel.query().insertAndFetch({
        width: width,
        height: height,
        length: length,
      })

      res.status(201).send({ result: newDimension })
    }
  )

  app.patch(
    "/dimension/:dimensionId",
    adminAuth,
    validate({
      body: {
        height: heightValidator,
        width: widthValidator,
        length: lengthValidator,
      },
      params: { dimensionId: idValidator.required() },
    }),
    async (req, res) => {
      const {
        params: { dimensionId },
        body: { width, height, length },
      } = req
      const dimension = await DimensionModel.query().findById(dimensionId)

      if (!dimension) {
        notFoundError(res)

        return
      }

      const updatedDimension = await DimensionModel.query()
        .patch({
          width: width ? width : ref("width"),
          height: height ? height : ref("height"),
          length: length ? length : ref("length"),
        })
        .findById(dimensionId)

      res.send({
        result: updatedDimension,
      })
    }
  )

  app.delete(
    "/dimension/:dimensionId",
    adminAuth,
    validate({ req: { params: { dimensionId: idValidator.required() } } }),
    async (req, res) => {
      const dimensionId = req.params.dimensionId
      const query = DimensionModel.query().findById(dimensionId)
      const dimension = await query

      if (!dimension) {
        notFoundError(res)

        return
      }

      const productsWithDimension = await ProductModel.query().where(
        "dimension_id",
        dimensionId
      )

      if (productsWithDimension && productsWithDimension.length !== 0) {
        res.status(500).send({
          error: "E.DIMENSION.IN_USE",
          products: productsWithDimension,
        })

        return
      }

      await query.delete()

      res.send({ result: "OK" })
    }
  )
}

export default dimensionsRoutes
