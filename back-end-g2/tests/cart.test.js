import request from "supertest"
import app from "../app"
import {
  expect404,
  expect409,
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers.js"
import { randomUUID } from "../helpers/fakerHelpers"
import CartModel from "../src/db/models/CartModel"
const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result
const adminUUIDCart = "6cce990d-3340-49c1-934a-9a1eff570883"
const guestUUIDCart = "ad7fce4e-42ab-4d38-9ec8-7718601a3840"
const userUUIDCart = "ad7fce4e-3340-4d38-9ec8-9a1eff570883"

const findCartByUUID = async (UUID) =>
  await CartModel.query().findOne({
    session_uuid: UUID,
  })
const guestCart = await findCartByUUID(guestUUIDCart)

const userCart = await findCartByUUID(userUUIDCart)

describe("Carts - GET", () => {
  it("Should be able to get a list of all carts as admin", async () => {
    const res = await request(app)
      .get(`/carts`)
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThanOrEqual(2)
  })
  it("Should not be able to get a list of all carts as guest", async () => {
    const res = await request(app)
      .get(`/carts`)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
  it("Should not be able to get a list of all carts as user", async () => {
    const res = await request(app).get(`/carts`)
    expectInvalidAuth(res)
  })

  it("Should be able to get their own carts when logged and using an uuid", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", `bearer ${adminToken}`)
      .set("uuid", adminUUIDCart)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.is_active).toBeTruthy()
    expect(res.body.result.session_uuid).toBe(adminUUIDCart)
  })

  it("Should be able to get their own carts as guest when using an uuid", async () => {
    const res = await request(app).get("/cart").set("uuid", guestUUIDCart)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.is_active).toBeTruthy()
    expect(res.body.result.session_uuid).toBe(guestUUIDCart)
  })

  it("Should be able to get someone else's cart as guest when using an uuid belonging to an user", async () => {
    const res = await request(app).get("/cart").set("uuid", adminUUIDCart)
    expect404(res)
  })

  it("Should not be able to usurp someone else's cart.", async () => {
    const res = await request(app)
      .get("/cart")
      .set("Authorization", `bearer ${userToken}`)
      .set("UUID", guestUUIDCart)

    const containsGuestCart = res.body.result.session_uuid === guestUUIDCart

    expect(containsGuestCart).toBe(false)
  })
})
describe("Carts - DELETE", () => {
  it("Should not let a guest try to delete any cart", async () => {
    const res = await request(app).delete(`/cart/${guestCart.id}`)
    expectInvalidAuth(res)
  })
  it("Should not be able to delete someone else's cart if not admin.", async () => {
    const res = await request(app)
      .delete(`/cart/${guestCart.id}`)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
  it("Should let admin delete any carts", async () => {
    const res = await request(app)
      .delete(`/cart/${guestCart.id}`)
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
  })
  it("Should let users delete their own carts", async () => {
    const res = await request(app)
      .delete(`/cart/${userCart.id}`)
      .set("Authorization", `bearer ${userToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.is_active).toBe(false)
  })
})

describe("Carts - POST", () => {
  it("Should not let a guest post a cart with no UUID", async () => {
    const res = await request(app).post(`/cart`)
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toBe("E.MISSING_UUID")
  })
  it("Should let a guest post a cart with an uuid", async () => {
    const randomUuid = randomUUID()
    const res = await request(app).post(`/cart`).set("UUID", randomUuid)

    expect(res.statusCode).toBe(201)
    expect(res.body.result.session_uuid).toBe(randomUuid)
    expect(res.body.result.user_id).toBe(null)
  })

  it("Should not let a user post a cart without an uuid while logged", async () => {
    const res = await request(app)
      .post(`/cart`)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(422)
    expect(res.body.error).toBe("E.MISSING_UUID")
  })

  it("Should let a user post a cart with an uuid while logged", async () => {
    const randomUuid = randomUUID()
    const res = await request(app)
      .post(`/cart`)
      .set("UUID", randomUuid)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(201)
    expect(res.body.result.session_uuid).toBe(randomUuid)
    expect(res.body.result.user_id).not.toBe(null)
    const cart = await findCartByUUID(randomUuid)
    await request(app)
      .delete(`/cart/${cart.id}`)
      .set("Authorization", `bearer ${userToken}`)
  })

  it("Should not let a user post a cart with an uuid that's already taken", async () => {
    const res = await request(app)
      .post(`/cart`)
      .set("UUID", adminUUIDCart)
      .set("Authorization", `bearer ${userToken}`)

    expect409(res)
  })
})

describe("CARTS - PATCH", () => {
  const newGuestUIID = randomUUID()

  it("Should transform guest carts into user carts", async () => {
    const newGuestCart = (
      await request(app).post(`/cart`).set("UUID", newGuestUIID)
    ).body.result

    expect(newGuestCart.user_id).toBe(null)

    const res = await request(app)
      .patch(`/cart/${newGuestCart.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.session_uuid).toBe(newGuestUIID)
    expect(res.body.result.user_id).not.toBe(null)
  })
  it("Should not let guest patch carts", async () => {
    const newGuestCart = await findCartByUUID(newGuestUIID)
    const res = await request(app).patch(`/cart/${newGuestCart.id}`)
    expectInvalidAuth(res)
  })
  it("Should not let users patch a cart that aready has a user_id", async () => {
    const adminCart = await findCartByUUID(adminUUIDCart)
    const res = await request(app)
      .patch(`/cart/${adminCart.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res, "E.BAD_REQUEST")
  })
})
