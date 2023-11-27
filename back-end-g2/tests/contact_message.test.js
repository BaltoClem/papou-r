import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers.js"
import ContactMessageModel from "../src/db/models/ContactMessageModel"

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

const message = await ContactMessageModel.query().findOne({
  email: "gemteszieu@gmail.com",
})

describe("CONTACT MESSAGES - GET", () => {
  it("Should be able to get the list of contact messages as an admin", async () => {
    const res = await request(app)
      .get("/contact")
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThanOrEqual(1)
  })

  it("Should not be able to get the list of contact messages as a user", async () => {
    const res = await request(app)
      .get("/contact")
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should not be able to get the list of contact messages as a guest", async () => {
    const res = await request(app).get("/contact")
    expectInvalidAuth(res)
  })

  it("Should be able to get the details of a single message as an admin", async () => {
    const res = await request(app)
      .get(`/contact/${message.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.email).toBe("gemteszieu@gmail.com")
  })
  it("Should be not able to get the details of a single message as an user", async () => {
    const res = await request(app)
      .get(`/contact/${message.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
  it("Should be not able to get the details of a single message as a guest", async () => {
    const res = await request(app).get(`/contact/${message.id}`)

    expectInvalidAuth(res)
  })
})

describe("CONTACT MESSAGES - POST", () => {
  it("Should be able to post a contact message, as a guest.", async () => {
    const res = await request(app).post("/contact").send({
      email: "email@notafake.com",
      text: "I really look forwards to seeing more colors!",
      title: "Waiting for new colors",
    })

    expect(res.statusCode).toBe(201)
  })

  it("Should not be able to post a contact message with an incorrect or missing email", async () => {
    let res = await request(app).post("/contact").send({
      email: "email",
      text: "I really look forwards to seeing more colors!",
      title: "Waiting for new colors",
    })

    expect(res.statusCode).toBe(422)

    res = await request(app).post("/contact").send({
      text: "I really look forwards to seeing more colors!",
      title: "Waiting for new colors",
    })

    expect(res.statusCode).toBe(422)
  })
})

describe("CONTACT MESSAGES - DELETE", () => {
  it("Should not be able to delete a contact message as an user", async () => {
    const res = await request(app)
      .delete(`/contact/${message.id}`)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
  it("Should not be able to delete a contact message as a guest", async () => {
    const res = await request(app).delete(`/contact/${message.id}`)
    expectInvalidAuth(res)
  })
  it("Should be able to delete a contact message as an admin", async () => {
    const res = await request(app)
      .delete(`/contact/${message.id}`)
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
  })
})
