import {
  adminOrSelfAuth,
  alreadyExistsError,
  insufficientPermissionError,
  notFoundError,
} from "../../../helpers/reponseHelpers.js"
import { adminAuth, auth, softAuth } from "../../middleware/auth.js"
import CartModel from "../../db/models/CartModel.js"
import { getCurrentUser, getUserId } from "../../../helpers/getterHelpers.js"
import validate from "../../middleware/validate.js"
import { idValidator } from "../../validators.js"

const getCart = async (UUID, userId) => {
  let cart

  if (userId) {
    cart = await CartModel.query()
      .withGraphFetched("all_products.product")
      .findOne({ user_id: userId, is_active: true })
  }

  if (!cart) {
    cart = await CartModel.query()
      .withGraphFetched("all_products.product")
      .findOne({
        session_uuid: UUID,
        is_active: true,
        user_id: null,
      })
  }

  return cart
}

const checkCartExistence = async (UUID, userId) => {
  let cart

  cart = await CartModel.query().where({
    session_uuid: UUID,
  })

  if (!cart && userId) {
    cart = await CartModel.query().where({ user_id: userId, is_active: true })
  }

  return cart
}

const cartRoutes = ({ app }) => {
  app.get("/carts", adminAuth, async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = CartModel.query()

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
    "/cart/:cartId",
    auth,
    validate({ params: { cartId: idValidator.required() } }),
    async (req, res) => {
      const cartId = req.params.cartId

      const cart = await CartModel.query()
        .findById(cartId)
        .withGraphFetched("all_products.product")

      const products = cart.all_products.map((cart_product) => {
        return { ...cart_product.product, quantity: cart_product.quantity }
      })
      const price = await cart.getCartPrice()
      const reformatedCartAndPrice = {
        cart_id: cart.id,
        is_active: cart.is_active,
        session_uuid: cart.session_uuid,
        user_id: cart.user_id,
        products: products,
        price: price,
      }

      if (!cart) {
        notFoundError(res)

        return
      }

      res.send({ result: reformatedCartAndPrice })
    }
  )

  app.get("/cart", softAuth, async (req, res) => {
    const {
      headers: { uuid: UUID },
    } = req

    const userId = getUserId(req)
    const cart = await getCart(UUID, userId)

    if (!cart || cart.length === 0) {
      notFoundError(res)

      return
    }

    const products = cart.all_products.map((cart_product) => {
      return { ...cart_product.product, quantity: cart_product.quantity }
    })
    const price = await cart.getCartPrice()
    const reformatedCartAndPrice = {
      cart_id: cart.id,
      is_active: cart.is_active,
      session_uuid: cart.session_uuid,
      user_id: cart.user_id,
      products: products,
      price: price,
    }

    res.send({ result: reformatedCartAndPrice })
  })

  app.post("/cart", softAuth, async (req, res) => {
    const {
      headers: { uuid: UUID },
    } = req
    const userId = getUserId(req)
    const cart = await checkCartExistence(UUID, userId)

    if (cart.length != 0) {
      alreadyExistsError(res)

      return
    }

    const newCart = await CartModel.query().insertAndFetch({
      ...{ session_uuid: UUID, is_active: true },
      ...(userId ? { user_id: userId } : {}),
    })

    res.status(201).send({ result: newCart })
  })

  app.delete("/cart/:cartId", auth, async (req, res) => {
    const cartId = req.params.cartId

    const cartToDelete = await CartModel.query().findById(cartId)

    if (!cartToDelete) {
      notFoundError(res)

      return
    }

    const currentUser = await getCurrentUser(req)

    if (!adminOrSelfAuth(res, currentUser, cartToDelete.user_id)) {
      return
    }

    const deletedCart = await CartModel.query()
      .patch({ is_active: false })
      .findById(cartId)
      .returning("*")

    res.send({ result: deletedCart })
  })

  app.patch("/cart/:cartId", auth, async (req, res) => {
    const cartId = req.params.cartId
    const cartToUpdate = await CartModel.query().findById(cartId)

    if (!cartToUpdate) {
      notFoundError(res)

      return
    }

    if (cartToUpdate.user_id) {
      insufficientPermissionError(res, "E.BAD_REQUEST")

      return
    }

    const userId = getUserId(req)

    const updatedCart = await CartModel.query()
      .patch({
        user_id: userId,
      })
      .findById(cartId)
      .returning("*")

    res.send({ result: updatedCart })
  })
}

export default cartRoutes
