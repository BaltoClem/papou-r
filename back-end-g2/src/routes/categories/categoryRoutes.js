import CategoryModel from "../../db/models/CategoryModel.js"
import {
  idValidator,
  imageValidator,
  slugValidator,
  stringValidator,
} from "../../validators.js"
import validate from "../../middleware/validate.js"
import {
  alreadyExistsError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { adminAuth } from "../../middleware/auth.js"
import ProductCategoriesModel from "../../db/models/ProductCategoriesModel.js"
import slugify from "@sindresorhus/slugify"
import { totalPages } from "../../../helpers/getterHelpers.js"

const categoryRoutes = ({ app }) => {
  app.get("/category", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = CategoryModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const categories = await query
    const total = totalPages(categories.length, limit)

    const record = await query.modify("paginate", limit, page)

    res.send({ result: { categories: record, totalPages: total } })
  })

  app.get(
    "/category/:categoryId",

    async (req, res) => {
      const { categoryId } = req.params

      const category = await CategoryModel.query()
        .withGraphFetched("products.product_images")
        .findById(categoryId)

      if (!category) {
        notFoundError(res, "E.CATEGORY.NOT_FOUND")

        return
      }

      res.send({
        result: category,
      })
    }
  )

  app.post(
    "/category",
    adminAuth,
    validate({
      body: {
        name: stringValidator.required(),
        slug: slugValidator,
        description: stringValidator.required(),
        image_url: imageValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        body: { name, slug, description, image_url },
      } = req.locals

      const realSlug = slug ? slug : slugify(name)
      const categoriesExist = await CategoryModel.query()
        .where("slug", realSlug)
        .select("id")

      if (categoriesExist.length !== 0) {
        alreadyExistsError(res)

        return
      }

      const newCategory = await CategoryModel.query()
        .insertAndFetch({
          name: name,
          slug: realSlug,
          description: description,
          image_url: image_url,
        })
        .returning("*")

      res.status(201).send({ result: newCategory })
    }
  )

  app.patch(
    "/category/:categoryId",
    adminAuth,
    validate({
      body: {
        name: stringValidator,
        slug: slugValidator,
        description: stringValidator,
        image_url: imageValidator,
      },
      params: { categoryId: idValidator.required() },
    }),

    async (req, res) => {
      const {
        body: { name, slug, description, image_url },
      } = req.locals

      const { categoryId } = req.params
      const category = await CategoryModel.query().findById(categoryId)

      if (!category) {
        notFoundError(res, "E.CATEGORY.NOT_FOUND")
      }

      if (slug) {
        const categoriesExist = await CategoryModel.query()
          .where("slug", slug)
          .select("id")

        if (
          categoriesExist.length !== 0 &&
          categoriesExist.find(
            (categoryExist) => categoryExist.id.toString() !== categoryId
          )
        ) {
          alreadyExistsError(res)

          return
        }
      }

      const updatedCategory = await CategoryModel.query()
        .update({
          ...(name ? { name } : {}),
          ...(slug ? { slug } : {}),
          ...(description ? { description } : {}),
          ...(image_url ? { image_url } : {}),
        })
        .findById(categoryId)
        .returning("*")

      res.send({
        result: updatedCategory,
      })
    }
  )

  app.delete(
    "/category/:categoryId",
    adminAuth,
    validate({ params: { categoryId: idValidator.required() } }),
    async (req, res) => {
      const { categoryId } = req.params
      const query = CategoryModel.query().findById(categoryId)
      const category = await query

      if (!category) {
        notFoundError(res, "E.CATEGORY.NOT_FOUND")

        return
      }

      await ProductCategoriesModel.query()
        .delete()
        .where("category_id", categoryId)

      await query.delete()

      res.send({ result: "OK" })
    }
  )
}

export default categoryRoutes
