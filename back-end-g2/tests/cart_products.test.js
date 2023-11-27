import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  loginAsUser,
} from "../helpers/testHelpers.js"
import { randomUUID } from "../helpers/fakerHelpers"
import CartModel from "../src/db/models/CartModel"
import ProductModel from "../src/db/models/ProductModel"
const userToken = (await loginAsUser()).body.result

const findCartByUUID = async (UUID) =>
  await CartModel.query().findOne({
    session_uuid: UUID,
  })

const product = await ProductModel.query().findOne({
  name: "Table 1",
})
const product2 = await ProductModel.query().findOne({
  name: "Chaise 1",
})

const guestUUID = randomUUID()
const userUUID = randomUUID()

describe("Carts Products - POST", () => {
  it("Should let a guest create a cart then add a product to it", async () => {
    const cart = await request(app).post(`/cart`).set("UUID", guestUUID)

    expect(cart.statusCode).toBe(201)
    const cardId = cart.body.result.id

    const res = await request(app)
      .post(`/cart/${cardId}/products`)
      .send({ productId: product.id, quantity: 2 })
      .set("UUID", guestUUID)
    expect(res.statusCode).toBe(201)
    expect(res.body.result.quantity).toBe(2)
  })
  it("Should let an user create a cart then add a product to it", async () => {
    const cart = await request(app).post(`/cart`).set("UUID", userUUID)

    expect(cart.statusCode).toBe(201)
    const cardId = cart.body.result.id

    const res = await request(app)
      .post(`/cart/${cardId}/products`)
      .send({ productId: product.id, quantity: 2 })
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(201)
    expect(res.body.result.quantity).toBe(2)
  })

  it("Should not let an user post to someone elses cart ", async () => {
    const cart = await findCartByUUID(guestUUID)

    const res = await request(app)
      .post(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 2 })
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })

  it("should require an uuid as a guest", async () => {
    const cart = await findCartByUUID(guestUUID)
    const res = await request(app)
      .post(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 2 })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toBe("E.MISSING_UUID")
  })
})

describe("Carts Products - PATCH", () => {
  it("Should let a guest change the quantity of a product in his cart", async () => {
    const cart = await findCartByUUID(guestUUID)

    const res = await await request(app)
      .patch(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 5 })
      .set("UUID", guestUUID)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.quantity).toBe(5)
  })
  it("Should let a user change the quantity of a product in his cart", async () => {
    const cart = await findCartByUUID(userUUID)

    const res = await await request(app)
      .patch(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 5 })
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.quantity).toBe(5)
  })
  it("Should not let a user change the quantity of a product in someone else's cart", async () => {
    const cart = await findCartByUUID(guestUUID)

    const res = await await request(app)
      .patch(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 5 })
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
  it("Should not let a guest change the quantity of a product that isnt in his cart", async () => {
    const cart = await findCartByUUID(guestUUID)
    const res = await await request(app)
      .patch(`/cart/${cart.id}/products`)
      .send({ productId: product2.id, quantity: 5 })
      .set("UUID", guestUUID)
    expect(res.statusCode).toBe(403)
    expect(res.body.error).toBe("E.PRODUCT_NOT_IN_CART")
  })
  it("should require an uuid as a guest", async () => {
    const cart = await findCartByUUID(guestUUID)
    const res = await request(app)
      .patch(`/cart/${cart.id}/products`)
      .send({ productId: product.id, quantity: 2 })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toBe("E.MISSING_UUID")
  })
})

describe("Carts Products - DELETE", () => {
  it("Should not let a guest remove a product that isnt in his cart", async () => {
    const cart = await findCartByUUID(guestUUID)
    const res = await request(app)
      .delete(`/cart/${cart.id}/products/${product2.id}`)
      .set("UUID", guestUUID)
    expect(res.statusCode).toBe(403)
    expect(res.body.error).toBe("E.PRODUCT_NOT_IN_CART")
  })

  it("Should let a guest remove a product from his cart", async () => {
    const cart = await findCartByUUID(guestUUID)

    const res = await request(app)
      .delete(`/cart/${cart.id}/products/${product.id}`)
      .set("UUID", guestUUID)
    expect(res.statusCode).toBe(200)
  })

  it("Should let an user remove a product from his cart", async () => {
    const cart = await findCartByUUID(userUUID)

    const res = await request(app)
      .delete(`/cart/${cart.id}/products/${product.id}`)
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
  })
  it("Should not let an user remove a product from someone else's cart", async () => {
    const cart = await findCartByUUID(guestUUID)

    const res = await request(app)
      .delete(`/cart/${cart.id}/products/${product.id}`)
      .set("UUID", userUUID)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("should require an uuid as a guest", async () => {
    const cart = await findCartByUUID(guestUUID)
    const res = await request(app).delete(
      `/cart/${cart.id}/products/${product.id}`
    )
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toBe("E.MISSING_UUID")
  })
})
