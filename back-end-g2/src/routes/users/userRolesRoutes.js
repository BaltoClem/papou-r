import RoleModel from "../../db/models/RoleModel.js"
import { idValidator, stringValidator } from "../../validators.js"
import validate from "../../middleware/validate.js"
import { adminAuth } from "../../middleware/auth.js"
import UserModel from "../../db/models/UserModel.js"
import UserRoleModel from "../../db/models/UserRoleModel.js"
import {
  alreadyExistsError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"

const userRoleRoutes = ({ app }) => {
  app.get("/user/:userId/roles", adminAuth, async (req, res) => {
    const userId = req.params.userId

    const record = (
      await UserModel.query()
        .withGraphFetched("roles")
        .modify("defaultSelects")
        .findById(userId)
    ).roles
    res.send({ result: record })
  })

  app.post(
    "/user/:userId/roles",
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

      const user = await UserModel.query()
        .withGraphFetched("roles")
        .modify("defaultSelects")
        .findById(req.params.userId)

      if (!user) {
        notFoundError(res, "E.USER_NOT_FOUND")

        return
      }

      const role = await RoleModel.query().findOne("name", name)

      if (!role) {
        notFoundError(res, "E.ROLE_NOT_FOUND")

        return
      }

      if (user.roles.some((v) => v.name === name)) {
        alreadyExistsError(res, "E.USER_ALREADY_HAS_ROLE")

        return
      }

      await UserRoleModel.query()
        .insertAndFetch({
          user_id: user.id,
          role_id: role.id,
        })
        .returning("*")

      res.status(201).send({ result: "OK" })
    }
  )

  app.delete(
    "/user/:userId/roles/:roleId",
    adminAuth,
    validate({ params: { roleId: idValidator.required() } }),
    async (req, res) => {
      const user = await UserModel.query()
        .withGraphFetched("roles")
        .modify("defaultSelects")
        .findById(req.params.userId)

      if (!user) {
        notFoundError(res, "E.USER_NOT_FOUND")

        return
      }

      if (
        !user.roles.some(({ id }) => id === parseInt(req.params.roleId, 10))
      ) {
        notFoundError(res, "E.USER_ROLES_FALSE")

        return
      }

      const role = await RoleModel.query().findOne("id", req.params.roleId)

      if (!role) {
        notFoundError(res, "E.ROLE_NOT_FOUND")

        return
      }

      if (role.name === "user") {
        res.status(400).send({ error: "E.CANNOT_DELETE_ROLE" })

        return
      }

      await UserRoleModel.query()
        .findOne({
          user_id: req.params.userId,
          role_id: role.id,
        })
        .delete()
        .returning("*")

      res.send({ result: "OK" })
    }
  )
}

export default userRoleRoutes
