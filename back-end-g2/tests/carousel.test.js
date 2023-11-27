import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Carousel - GET", () => {
  it("Should be able to get all images of carousel", async () => {
    const res = await request(app).get("/carousel")

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toHaveLength(3)
  })
})

describe("Carousel - POST", () => {
  it("should not be able to add image to carousel if not admin", async () => {
    const res = await request(app)
      .post("/carousel")
      .send({
        image_url: "/image.png",
      })
      .set("Authorization", `Bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("should not be able to add image to carousel as a guest", async () => {
    const res = await request(app).post("/carousel").send({
      image_url: "/image.png",
    })

    expectInvalidAuth(res)
  })

  it("Should be able to add image to carousel", async () => {
    const res = await request(app)
      .post("/carousel")
      .send({ image_url: "/image.png" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(201)
    expect(res.body.result.image_url).toBe("/image.png")
  })
})

describe("Carousel - DELETE", () => {
  it("Should allow admins to delete image to carousel", async () => {
    const res = await request(app)
      .delete(`/carousel`)
      .send({ image_url: "/image.png" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("Should not allow guest to image to carousel if not logged in", async () => {
    const res = await request(app)
      .delete(`/carousel`)
      .send({ image_url: "/image.png" })
    expectInvalidAuth(res)
  })

  it("Should not allow users to delete image to carousel if not logged in as admin", async () => {
    const res = await request(app)
      .delete(`/carousel`)
      .send({ image_url: "/image.png" })
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
})
