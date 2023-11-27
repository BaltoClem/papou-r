import OrderModel from "../../db/models/OrderModel.js"
import { idValidator } from "../../validators.js"
import validate from "../../middleware/validate.js"
import { adminAuth, auth } from "../../middleware/auth.js"
import {
  adminOrSelfAuth,
  alreadyExistsError,
  internalError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import {
  getCart,
  getCurrentUser,
  getOrder,
} from "../../../helpers/getterHelpers.js"
import config from "../../config.js"
import Stripe from "stripe"
import CartModel from "../../db/models/CartModel.js"
import ProductModel from "../../db/models/ProductModel.js"
const stripe = new Stripe(config.stripeApiKey)

const createLineItem = (product, quantity) => {
  return {
    price_data: {
      currency: "GBP",
      product_data: {
        name: product.name,
      },
      unit_amount: product.price * 100,
    },
    quantity: quantity,
  }
}

const orderRoutes = ({ app }) => {
  app.get("/order", adminAuth, async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = OrderModel.query()

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
    "/order/:orderId",
    auth,
    validate({ params: { orderId: idValidator.required() } }),
    async (req, res) => {
      const {
        params: { orderId: orderId },
      } = req
      const order = await getOrder(orderId, res)

      if (!order) {
        return
      }

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, order.user_id)) {
        return
      }

      res.send({ result: order })
    }
  )

  app.post(
    "/order",
    auth,
    validate({
      body: {
        cart_id: idValidator.required(),
        address_id: idValidator.required(),
      },
    }),

    async (req, res) => {
      const {
        locals: {
          body: { address_id, cart_id },
        },
      } = req

      const orderExists = await OrderModel.query().where({
        address_id: address_id,
        cart_id: cart_id,
      })

      if (orderExists.length !== 0) {
        alreadyExistsError(res)

        return
      }

      const cart = await getCart(cart_id, res)

      if (!cart) {
        return
      }

      if (!cart.is_active) {
        res.status(400).send("E.CART.ALREADY_PAID")
      }

      if (!cart.user_id) {
        internalError(res, "E.USERLESS_CART")

        return
      }

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, cart.user_id)) {
        return
      }

      let inStock = true

      await Promise.all(
        cart.all_products.map(async (productInCart) => {
          const query = ProductModel.query().findById(productInCart.product_id)
          const product = await query

          if (productInCart.quantity > product.stock) {
            res.status(500).send({ error: "E.NOT_STOCK_ENOUGH" })
            inStock = false

            return
          }
        })
      )

      if (!inStock) {
        return
      }

      const line_items = cart.all_products.map((product_info) =>
        createLineItem(product_info.product, product_info.quantity)
      )

      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${config.frontUrl}/payment?success`,
        cancel_url: `${config.frontUrl}/payment?cancel`,
      })

      const price = await cart.getCartPrice()
      const itemsQuantities = await cart.getItemsQuantities()

      const newOrder = await OrderModel.query()
        .insert({
          address_id: address_id,
          cart_id: cart_id,
          user_id: cart.user_id,
          status: "initiated",
          session_id: session.id,
          deleted: false,
          amount: price,
          itemsQuantities: itemsQuantities,
        })
        .returning("*")

      await CartModel.query()
        .findById(cart_id)
        .patch({ is_active: false })
        .withGraphFetched("all_products")
        .returning("*")

      res.status(201).send({
        result: {
          order: newOrder,
          payment_link: session.url,
        },
      })
    }
  )

  app.patch(
    "/order/:orderId",
    auth,
    validate({
      body: {
        address_id: idValidator.required(),
      },
      params: { orderId: idValidator.required() },
    }),

    async (req, res) => {
      const {
        locals: {
          body: { address_id },
        },
        params: { orderId: orderId },
      } = req

      const order = await getOrder(orderId, res)

      if (!order) {
        return
      }

      const currentUser = await getCurrentUser(req)

      if (!adminOrSelfAuth(res, currentUser, order.cart.user_id)) {
        return
      }

      const updatedorder = await OrderModel.query()
        .update({
          ...(address_id ? { address_id } : {}),
        })
        .findOne({ id: orderId })
        .returning("*")

      res.send({ result: updatedorder })
    }
  )

  app.delete(
    "/order/:orderId",
    adminAuth,
    validate({ params: { orderId: idValidator.required() } }),
    async (req, res) => {
      const query = OrderModel.query().findById(req.params.orderId)
      const order = await query

      if (!order) {
        notFoundError(res)

        return
      }

      await query.update({ ...order, deleted: true })

      res.send({ result: "OK" })
    }
  )
}

export default orderRoutes
