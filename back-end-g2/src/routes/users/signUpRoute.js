import validate from "../../middleware/validate.js"
import hashPassword from "../../db/methods/hashPassword.js"
import UserModel from "../../db/models/UserModel.js"
import {
  emailValidator,
  nameValidator,
  phoneNumberValidator,
  passwordValidator,
} from "../../validators.js"
import RoleModel from "../../db/models/RoleModel.js"
import UserRoleModel from "../../db/models/UserRoleModel.js"
import {
  generateDynamicTemplateEmailForUserByTemplateID,
  sendEmailTemplate,
  signJWTForUser,
  templateIdConfirmationMail,
} from "../../../helpers/emailHelpers.js"
import { auth } from "../../middleware/auth.js"
import { getCurrentUser } from "../../../helpers/getterHelpers.js"

const signUpRoute = ({ app }) => {
  app.post(
    "/user",
    validate({
      body: {
        display_name: nameValidator.required("E.MISSING.display_name"),
        email: emailValidator.required("E.MISSING.email"),
        phone_number: phoneNumberValidator.required("E.MISSING.phone"),
        password: passwordValidator.required("E.MISSING.password"),
      },
    }),
    async (req, res) => {
      const { email, password, display_name, phone_number } = req.locals.body

      const user = await UserModel.query().findOne({ email: email })

      if (user) {
        res.status(201).send({ result: "OK" })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      const current_time = new Date()
      const newUser = await UserModel.query()
        .insertAndFetch({
          display_name: display_name ? display_name : null,
          email: email,
          phone_number: phone_number,
          password_hash: passwordHash,
          password_salt: passwordSalt,
          createdAt: current_time,
          updatedAt: current_time,
        })
        .returning("*")

      const jwt = signJWTForUser(newUser)

      const confirmationEmailTemplate =
        generateDynamicTemplateEmailForUserByTemplateID(
          templateIdConfirmationMail,
          email,
          jwt
        )

      const emailSent = await sendEmailTemplate(confirmationEmailTemplate, res)

      if (!emailSent) {
        // Prevent's user account from being locked if he nevers receives the email.
        await UserModel.query().findById(newUser.id).delete()

        return
      }

      const basicRole = await RoleModel.query().findOne({ name: "user" })

      await UserRoleModel.query()
        .insert({
          user_id: newUser.id,
          role_id: basicRole.id,
        })
        .returning("*")

      res.status(201).send({ result: "OK" })
    }
  )

  app.patch("/user/confirmation", auth, async (req, res) => {
    const currentUser = await getCurrentUser(req)

    if (!currentUser) {
      return
    }

    const updatedUser = await UserModel.query()
      .patch({ confirmed: true })
      .findById(currentUser.id)
      .returning("*")

    res.send({ result: updatedUser })
  })
}

export default signUpRoute
