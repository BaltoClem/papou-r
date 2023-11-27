import {
  alreadyExistsError,
  notFoundError,
} from "../../helpers/reponseHelpers.js"
import { adminAuth } from "../middleware/auth.js"
import CarouselModel from "../db/models/CarouselModel.js"

const carouselRoutes = ({ app }) => {
  app.get("/carousel", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = CarouselModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record })
  })

  app.post("/carousel", adminAuth, async (req, res) => {
    const { image_url } = req.body

    const imageCarouselExist = await CarouselModel.query().findOne({
      image_url: image_url,
    })

    if (imageCarouselExist && imageCarouselExist.length >= 1) {
      alreadyExistsError(res)

      return
    }

    const newImageCategory = await CarouselModel.query()
      .insertAndFetch({
        image_url: image_url,
      })
      .returning("*")

    res.status(201).send({ result: newImageCategory })
  })

  app.delete("/carousel", adminAuth, async (req, res) => {
    const { image_url } = req.body
    const query = CarouselModel.query().findOne({ image_url: image_url })
    const category = await query

    if (!category) {
      notFoundError(res, "E.CAROUSEL.NOT_FOUND")

      return
    }

    await query.delete()

    res.send({ result: "OK" })
  })
}

export default carouselRoutes
