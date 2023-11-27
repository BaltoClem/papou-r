import CartModel from "../src/db/models/CartModel.js"
import CategoryModel from "../src/db/models/CategoryModel.js"
import OrderModel from "../src/db/models/OrderModel.js"
import ProductModel from "../src/db/models/ProductModel.js"
import UserModel from "../src/db/models/UserModel.js"
import { notFoundError } from "./reponseHelpers.js"

export const getCurrentUser = async (req) => {
  const userId = getUserId(req)

  if (!userId) {
    return
  }

  return await UserModel.query().withGraphFetched("roles").findById(userId)
}

export const getUserId = (req) => {
  if (!req.locals.session) {
    return
  }

  return parseInt(req.locals.session.user.id, 10)
}

export const getCart = async (cartId, res) => {
  const cart = await CartModel.query()
    .findById(cartId)
    .withGraphFetched("[all_products.product]")

  if (!cart) {
    notFoundError(res, "E.CART.NOT_FOUND")
  }

  return cart
}

export const getProduct = async (productId, res) => {
  const product = await ProductModel.query().findById(productId)

  if (!product) {
    notFoundError(res, "E.PRODUCT.NOT_FOUND")
  }

  return product
}

export const getOrder = async (orderId, res) => {
  const order = await OrderModel.query().findById(orderId)

  if (!order) {
    notFoundError(res)

    return
  }

  return order
}

export const getRelatedProducts = async (product) => {
  const categoriesId = product.product_categories.map(({ id }) => {
    return id
  })

  const categoryWithProducts = await CategoryModel.query()
    .withGraphFetched("products.product_images")
    .whereIn("id", categoriesId)
    .modify("paginate", 5)

  const productsArray = categoryWithProducts.map(({ products }) => products)

  return productsArray
    .flat()
    .filter((current_product) => product.id !== current_product.id)
    .slice(0, 5)
}

export const totalPages = (countOfElement, limit = 20) => {
  return Math.floor(countOfElement / limit + 1)
}
