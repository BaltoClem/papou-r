import UserModel from "../../db/models/UserModel.js"
import validate from "../../middleware/validate.js"
import {
  emailValidator,
  passwordValidator,
  stringValidator,
} from "../../validators.js"
import {
  generateDynamicTemplateEmailForUserByTemplateID,
  sendEmailTemplate,
  signJWTForUser,
  templateIdForgottenPassword,
} from "../../../helpers/emailHelpers.js"
import { auth } from "../../middleware/auth.js"
import { getUserId } from "../../../helpers/getterHelpers.js"
import { notFoundError } from "../../../helpers/reponseHelpers.js"
import hashPassword from "../../db/methods/hashPassword.js"

const signInRoute = ({ app }) => {
  app.post(
    "/sign-in",
    validate({
      body: {
        email: emailValidator.required(),
        password: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, password } = req.locals.body
      const user = await UserModel.query().findOne({
        email: email,
      })

      if (!user || !(await user.checkPassword(password))) {
        res.status(401).send({ error: "E.INVALID.CREDENTIAL" })

        return
      }

      if (!user.confirmed) {
        res.status(403).send({ error: "E.UNCONFIRMED_ACCOUNT" })

        return
      }

      const jwt = signJWTForUser(user)
      res.send({ result: jwt })
    }
  )
  app.post(
    "/user/forgotten_password",
    validate({
      body: {
        email: emailValidator.required(),
      },
    }),
    async (req, res) => {
      const { email } = req.body

      const user = await UserModel.query().findOne({ email: email })

      if (!user) {
        res.send({ result: "OK" })

        return
      }

      const jwt = signJWTForUser(user)

      const forgottenEmailTemplate =
        generateDynamicTemplateEmailForUserByTemplateID(
          templateIdForgottenPassword,
          email,
          jwt
        )

      const emailSent = await sendEmailTemplate(forgottenEmailTemplate, res)

      if (!emailSent) {
        return
      }

      res.send({ result: "OK" })
    }
  )
  app.patch(
    "/user/forgotten_password",
    auth,
    validate({
      body: {
        password: passwordValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        body: { password },
      } = req

      const userId = getUserId(req)

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

      await UserModel.query()
        .update({
          ...(passwordHash ? { password_hash: passwordHash } : {}),
          ...(passwordSalt ? { password_salt: passwordSalt } : {}),
        })
        .findById(userId)

      res.send({
        result: "OK",
      })
    }
  )
}

export default signInRoute
