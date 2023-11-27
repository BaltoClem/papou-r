import sgMail from "@sendgrid/mail"
import { internalError } from "./reponseHelpers.js"
import jsonwebtoken from "jsonwebtoken"
import config from "../src/config.js"

export const templateIdForgottenPassword = "d-bc0f046888974f25bf196db7334e9ad3"
export const templateIdConfirmationMail = "d-2b283b58c5f84c7184888eb1524ba3a3"

export const signJWTForUser = (user) =>
  jsonwebtoken.sign(
    {
      payload: {
        user: {
          id: user.id,
        },
      },
    },
    config.security.jwt.secret,
    { expiresIn: config.security.jwt.expiresIn }
  )

export const generateDynamicTemplateEmailForUserByTemplateID = (
  templateId,
  email,
  jwt
) => {
  return {
    to: email,
    from: process.env.MAIL_SEND_GRID,
    templateId: templateId,
    dynamic_template_data: {
      jwt: jwt,
    },
  }
}

export const sendEmailTemplate = async (template, res) => {
  if (process.env.NODE_ENV) {
    return true
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  try {
    await sgMail.send(template)

    return true
  } catch (err) {
    internalError(res, err.response.body.errors)

    return false
  }
}
