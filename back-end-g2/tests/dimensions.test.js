import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"

const adminToken = (await loginAsAdmin()).body.result

describe("Dimension - POST", () => {
  it("guest should not be able to post new dimensions", async () => {
    const res = await request(app).post("/dimension").send({
      width: 400,
      height: 400,
      length: 400,
    })

    expectInvalidAuth(res)
  })

  it("non admins should not be able to register with all informations correct", async () => {
    const token = (await loginAsUser()).body.result

    const res = await request(app)
      .post("/dimension")
      .send({
        width: 400,
        height: 400,
        length: 400,
      })
      .set("Authorization", `bearer ${token}`)
    expectInsufficientPermission(res)
  })

  it("admins should be able to register with all informations correct", async () => {
    const res = await request(app)
      .post("/dimension")
      .send({
        width: 400,
        length: 400,
        height: 400,
      })
      .set("Authorization", `bearer ${adminToken}`)
    const dimensions = res.body.result
    expect(res.statusCode).toBe(201)
    expect(dimensions.height).toBe(400)
    expect(dimensions.width).toBe(400)
  })
  it("admins should not be able to add a new dimensions without a width ", async () => {
    const res = await request(app)
      .post("/dimension")
      .send({
        height: 1,
        length: 400,
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.width"])
  })

  it("admins should not be able to register with an invalid width ", async () => {
    const res = await request(app)
      .post("/dimension")
      .send({
        width: 1.345,
        length: 400,
        height: 1,
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.INVALID.integer"])
  })
})
