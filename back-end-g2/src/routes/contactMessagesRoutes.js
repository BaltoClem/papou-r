import validate from "../middleware/validate.js"
import { notFoundError } from "../../helpers/reponseHelpers.js"
import { adminAuth } from "../middleware/auth.js"
import ContactMessageModel from "../db/models/ContactMessageModel.js"
import { emailValidator, idValidator, stringValidator } from "../validators.js"

const contactMessageRoute = ({ app }) => {
  app.get("/contact", adminAuth, async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = ContactMessageModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record })
  })

  app.get("/contact/:messageId", adminAuth, async (req, res) => {
    const messageId = req.params.messageId
    const message = await ContactMessageModel.query().findById(messageId)

    if (!message) {
      notFoundError(res)

      return
    }

    res.send({ result: message })
  })

  app.post(
    "/contact",
    validate({
      body: {
        email: emailValidator.required(),
        title: stringValidator.required(),
        text: stringValidator.required(),
      },
    }),
    async (req, res) => {
      const { email, title, text } = req.body

      await ContactMessageModel.query().insert({
        email: email,
        title: title,
        text: text,
      })

      res.status(201).send({ result: "OK" })
    }
  )

  app.delete(
    "/contact/:messageId",
    validate({ req: { params: { messageId: idValidator.required() } } }),
    adminAuth,
    async (req, res) => {
      const messageId = req.params.messageId
      const query = ContactMessageModel.query().findById(messageId)
      const message = await query

      if (!message) {
        notFoundError(res)

        return
      }

      await query.delete()

      res.send({ result: "OK" })
    }
  )
}

export default contactMessageRoute
