import RoleModel from "../db/models/RoleModel.js"
import { idValidator, stringValidator } from "../validators.js"
import validate from "../middleware/validate.js"
import { adminAuth } from "../middleware/auth.js"
import {
  alreadyExistsError,
  notFoundError,
} from "../../helpers/reponseHelpers.js"

const roleRoutes = ({ app }) => {
  app.get("/role", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = RoleModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record })
  })

  app.get(
    "/role/:roleId",
    validate({ params: { roleId: idValidator.required() } }),
    async (req, res) => {
      const role = await RoleModel.query().findById(req.params.roleId)

      if (!role) {
        notFoundError(res)

        return
      }

      res.status(200).send({ role })
    }
  )

  app.post(
    "/role",
    adminAuth,
    validate({
      body: {
        name: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        body: { name },
      } = req.locals

      const roleExists = await RoleModel.query().findOne("name", name)

      if (roleExists) {
        alreadyExistsError(res)

        return
      }

      const newRole = await RoleModel.query()
        .insert({
          name: name,
        })
        .returning("*")

      res.status(201).send({ result: newRole })
    }
  )

  app.patch(
    "/role/:roleId",
    adminAuth,
    validate({
      body: {
        name: stringValidator.required(),
      },
      params: { roleId: idValidator.required() },
    }),

    async (req, res) => {
      const {
        body: { name },
      } = req.locals

      const query = RoleModel.query().findById(req.params.roleId)
      const role = await query

      if (!role) {
        notFoundError(res)

        return
      }

      const roleExists = await RoleModel.query().findOne("name", name)

      if (roleExists) {
        alreadyExistsError(res)

        return
      }

      const updatedRole = await RoleModel.query()
        .update({
          ...(name ? { name } : {}),
        })
        .findOne({ id: req.params.roleId })
        .returning("*")

      res.send({ result: updatedRole })
    }
  )

  app.delete(
    "/role/:roleId",
    adminAuth,
    validate({ params: { roleId: idValidator.required() } }),
    async (req, res) => {
      const query = RoleModel.query().findById(req.params.roleId)
      const role = await query

      if (!role) {
        notFoundError(res)

        return
      }

      await query.delete()

      res.send({ result: "OK" })
    }
  )
}

export default roleRoutes
