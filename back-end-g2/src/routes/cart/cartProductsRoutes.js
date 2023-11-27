import { idValidator, positiveIntegerValidator } from "../../validators.js"
import validate from "../../middleware/validate.js"
import {
  adminOrSelfAuth,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import CartModel from "../../db/models/CartModel.js"
import CartProductModel from "../../db/models/CartProductsModel.js"
import {
  getCart,
  getCurrentUser,
  getProduct,
} from "../../../helpers/getterHelpers.js"
import { softAuth } from "../../middleware/auth.js"

const doesCartContainProduct = (cart, product) => {
  if (cart.all_products && cart.all_products.length == 0) {
    return false
  }

  return cart.all_products.some((cart_product) => {
    return cart_product.product.id === product.id
  })
}

const cartProductRoutes = ({ app }) => {
  app.get("/cart/:cartId/products", softAuth, async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = CartModel.query()
      .withGraphFetched("products")
      .findById(req.params.cartId)

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    if (!record) {
      notFoundError(res)

      return
    }

    res.send({ result: record.products })
  })

  app.post(
    "/cart/:cartId/products",
    softAuth,
    validate({
      body: {
        productId: positiveIntegerValidator.required(),
        quantity: positiveIntegerValidator.required(),
      },
    }),
    async (req, res) => {
      const {
        locals: {
          body: { productId, quantity },
        },
        headers: { uuid: UUID },
      } = req
      const { cartId } = req.params

      const cart = await getCart(cartId, res)

      if (!cart) {
        return
      }

      const currentUser = await getCurrentUser(req)

      if (cart.session_uuid !== UUID) {
        if (!adminOrSelfAuth(res, currentUser, cart.user_id)) {
          return
        }
      }

      const product = await getProduct(productId, res)

      if (!product) {
        return
      }

      if (doesCartContainProduct(cart, product)) {
        const newQuantity =
          quantity +
          (
            await CartProductModel.query()
              .findOne({ product_id: product.id })
              .select("quantity")
          ).quantity

        const updatedQuantityOfProduct = await CartProductModel.query()
          .findOne({ product_id: product.id })
          .update({ quantity: newQuantity })

        res.send({ result: updatedQuantityOfProduct })

        return
      }

      const addedProduct = await CartProductModel.query().insertAndFetch({
        cart_id: cartId,
        product_id: productId,
        quantity: quantity,
      })

      res.status(201).send({ result: addedProduct })
    }
  )

  app.patch(
    "/cart/:cartId/products",
    softAuth,
    validate({
      body: {
        productId: idValidator.required("E.INVALID.PRODUCT_ID"),
        quantity: positiveIntegerValidator.required("E.NON_POSITIVE.QUANTITY"),
      },
    }),
    async (req, res) => {
      const { cartId } = req.params
      const {
        locals: {
          body: { productId, quantity },
        },
        headers: { uuid: UUID },
      } = req

      const cart = await getCart(cartId, res)

      if (!cart) {
        return
      }

      const currentUser = await getCurrentUser(req)

      if (cart.session_uuid !== UUID) {
        if (!adminOrSelfAuth(res, currentUser, cart.user_id)) {
          return
        }
      }

      const product = await getProduct(productId, res)

      if (!product) {
        return
      }

      if (!doesCartContainProduct(cart, product)) {
        res.status(403).send({ error: "E.PRODUCT_NOT_IN_CART" })

        return
      }

      const updatedProduct = await CartProductModel.query()
        .patch({ quantity })
        .findOne({ cart_id: cartId, product_id: productId })
        .returning("*")
      res.send({ result: updatedProduct })
    }
  )

  app.delete(
    "/cart/:cartId/products/:productId",
    softAuth,
    async (req, res) => {
      const { cartId, productId } = req.params
      const {
        headers: { uuid: UUID },
      } = req
      const cart = await getCart(cartId, res)

      if (!cart) {
        return
      }

      const currentUser = await getCurrentUser(req)

      if (
        cart.session_uuid !== UUID &&
        !adminOrSelfAuth(res, currentUser, cart.user_id)
      ) {
        return
      }

      const product = await getProduct(productId, res)

      if (!product) {
        return
      }

      if (!doesCartContainProduct(cart, product)) {
        res.status(403).send({ error: "E.PRODUCT_NOT_IN_CART" })

        return
      }

      await CartProductModel.query()
        .delete()
        .where({ cart_id: cartId, product_id: productId })
      res.send({ result: "OK" })
    }
  )
}

export default cartProductRoutes
