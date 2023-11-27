import OrderModel from "../../db/models/OrderModel.js"
import config from "../../config.js"
import Stripe from "stripe"
import { notFoundError } from "../../../helpers/reponseHelpers.js"
import ProductModel from "../../db/models/ProductModel.js"
import { getCart } from "../../../helpers/getterHelpers.js"
const stripe = new Stripe(config.stripeApiKey)

const orderWebHooks = ({ app }) => {
  app.post("/order/webhook", async (req, res) => {
    const payload = req.rawBody
    const sig = req.headers["stripe-signature"]

    let event

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        config.endpointSecret
      )
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type.match("checkout.session")) {
      const session = await stripe.checkout.sessions.retrieve(
        event.data.object.id
      )
      const query = OrderModel.query().findOne({ session_id: session.id })
      const order = await query

      if (!order) {
        notFoundError(res)

        return
      }

      const cart = await getCart(order.cart_id, res)

      await Promise.all(
        cart.all_products.map(async (productInCart) => {
          const query = ProductModel.query().findById(productInCart.product_id)
          const product = await query
          await query.patch({
            stock: product.stock - productInCart.quantity,
          })
        })
      )

      await query
        .patch({
          status: session.status,
        })
        .returning("*")
    }

    res.status(200).end()
  })
}

export default orderWebHooks
