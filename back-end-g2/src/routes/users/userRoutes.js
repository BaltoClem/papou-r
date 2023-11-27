import validate from "../../middleware/validate.js"
import UserModel from "../../db/models/UserModel.js"
import { adminAuth, auth } from "../../middleware/auth.js"
import {
  idValidator,
  nameValidator,
  emailValidator,
  passwordValidator,
  phoneNumberValidator,
} from "../../validators.js"
import hashPassword from "../../db/methods/hashPassword.js"
import {
  adminOrSelfAuth,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { getCurrentUser, totalPages } from "../../../helpers/getterHelpers.js"

const userRoutes = ({ app }) => {
  app.get("/user", adminAuth, async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = UserModel.query().modify("defaultSelects")

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const users = await query
    const total = totalPages(users.length, limit)

    const record = await query.modify("paginate", limit, page)
    res.send({ result: { users: record, totalPages: total } })
  })

  app.get(
    "/user/:userId",
    auth,
    validate({ req: { userId: idValidator.required() } }),
    async (req, res) => {
      const userId = req.params.userId

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, userId)) {
        return
      }

      const user = await UserModel.query()
        .findById(userId)
        .modify("defaultSelects")
        .withGraphFetched(
          "[current_addresses(onlyInUse), orders(onlyNotDeleted)]"
        )
        .modifiers({
          onlyInUse(builder) {
            builder.where("in_use", true)
          },

          onlyNotDeleted(builder) {
            builder.where("deleted", false).orderBy("createdAt")
          },
        })

      if (!user) {
        notFoundError(res)

        return
      }

      res.send({ result: user })
    }
  )

  app.patch(
    "/user/:userId",
    auth,
    validate({
      body: {
        display_name: nameValidator,
        email: emailValidator,
        password: passwordValidator,
        phone_number: phoneNumberValidator,
      },
      req: {
        userId: idValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        params: { userId },
        body: { display_name, email, password, phone_number },
      } = req

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, userId)) {
        return
      }

      const user = await UserModel.query().findById(userId)

      if (!user) {
        notFoundError(res)

        return
      }

      let passwordHash
      let passwordSalt

      if (password) {
        ;[passwordHash, passwordSalt] = await hashPassword(password)
      }

      const updatedUser = await UserModel.query()
        .update({
          ...(display_name ? { display_name } : {}),
          ...(email ? { email } : {}),
          ...(phone_number ? { phone_number } : {}),
          ...(passwordHash ? { password_hash: passwordHash } : {}),
          ...(passwordSalt ? { password_salt: passwordSalt } : {}),
        })
        .findById(userId)
        .modify("defaultSelects")
        .returning("*")

      res.send({
        result: updatedUser,
      })
    }
  )

  app.delete(
    "/user/:userId",
    auth,
    validate({ req: { userId: idValidator.required() } }),
    async (req, res) => {
      const { userId } = req.params

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, userId)) {
        return
      }

      const query = UserModel.query().findById(userId)
      const user = await query

      if (!user) {
        notFoundError(res)

        return
      }

      await query
        .update({
          ...{ deleted: true },
        })
        .modify("defaultSelects")
        .returning("*")

      res.send({ result: "OK" })
    }
  )
}

export default userRoutes
