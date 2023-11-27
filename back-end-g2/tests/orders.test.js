import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
  loginAsWanted,
} from "../helpers/testHelpers.js"
import { randomUUID } from "../helpers/fakerHelpers"
import UserModel from "../src/db/models/UserModel"
import ProductModel from "../src/db/models/ProductModel"
import { signJWTForUser } from "../helpers/emailHelpers"
const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

const product = await ProductModel.query().findOne({
  name: "Table 1",
})
const product2 = await ProductModel.query().findOne({
  name: "Table 3",
})

describe("Orders - POST", () => {
  it("Should allow a guest to create a cart, add products into it then turn it onto an order", async () => {
    const guestUUID = randomUUID()

    const cart = await request(app).post(`/cart`).set("UUID", guestUUID)

    expect(cart.statusCode).toBe(201)

    const cartId = cart.body.result.id

    const firstProduct = await request(app)
      .post(`/cart/${cartId}/products`)
      .send({ productId: product.id, quantity: 2 })
      .set("UUID", guestUUID)

    const secondProduct = await request(app)
      .post(`/cart/${cartId}/products`)
      .send({ productId: product2.id, quantity: 2 })
      .set("UUID", guestUUID)

    expect(firstProduct.statusCode).toBe(201)
    expect(secondProduct.statusCode).toBe(201)

    const password = "JeTr@va1lleP@s!!"
    const email = "joachim@gmail.com"
    const displayName = "Joachim Michaom"

    const register = await request(app).post("/user").send({
      password: password,
      email: email,
      phone_number: "+33666666666",
      display_name: displayName,
    })
    expect(register.statusCode).toBe(201)

    const user = await UserModel.query().findOne({ email: email })

    const userAuth = signJWTForUser(user)

    const confirmationRes = await request(app)
      .patch("/user/confirmation")
      .set("Authorization", `bearer ${userAuth}`)
    expect(confirmationRes.statusCode).toBe(200)
    expect(confirmationRes.body.result.confirmed).toBeTruthy()

    const newUserToken = (await loginAsWanted(email, password)).body.result

    const transferedCart = await request(app)
      .patch(`/cart/${cartId}`)
      .set("Authorization", `bearer ${newUserToken}`)

    expect(transferedCart.statusCode).toBe(200)

    const userAddress = await request(app)
      .post("/address")
      .send({
        fullname: displayName,
        street_name: "8 rue des piafs",
        zipcode: 77176,
        city: "Savignuwu-Le-Temple",
        country: "France",
        complement: "",
        order: 1,
        user_id: user.id,
      })
      .set("Authorization", `bearer ${newUserToken}`)

    expect(userAddress.statusCode).toBe(201)

    const cartPrice = await request(app)
      .get("/cart")
      .set("Authorization", `bearer ${newUserToken}`)
      .set("UUID", guestUUID)

    expect(cartPrice.statusCode).toBe(200)

    const order = await request(app)
      .post("/order")
      .send({
        cart_id: cartId,
        address_id: userAddress.body.result.id,
      })
      .set("Authorization", `bearer ${newUserToken}`)
    expect(order.statusCode).toBe(201)
  })

  it("Should not let guest post an order", async () => {
    const order = await request(app).post("/order")
    expectInvalidAuth(order)
  })
})

describe("Orders - GET", () => {
  it("Should be able to get a list of all orders as admin", async () => {
    const res = await request(app)
      .get(`/order`)
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThanOrEqual(1)
  })
  it("Should not be able to get a list of all orders as guest", async () => {
    const res = await request(app)
      .get(`/order`)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
  it("Should not be able to get a list of all carts as user", async () => {
    const res = await request(app).get(`/order`)
    expectInvalidAuth(res)
  })
})
