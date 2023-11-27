import request from "supertest"
import app from "../app"
import UserModel from "../src/db/models/UserModel"
import { signJWTForUser } from "../helpers/emailHelpers"

describe("User signup", () => {
  it("should be able to register with all informations correct", async () => {
    const res = await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      email: "patrickbalkany@gmail.com",
      phone_number: "+33666666666",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(201)
    expect(res.body.result).toBe("OK")

    const insertedUser = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ email: "patrickbalkany@gmail.com" })
    expect(insertedUser.roles).toHaveLength(1)
    expect(insertedUser.roles[0].name).toBe("user")
    expect(insertedUser.confirmed).toBeFalsy()

    const userAuth = signJWTForUser(insertedUser)

    const confirmationRes = await request(app)
      .patch("/user/confirmation")
      .set("Authorization", `bearer ${userAuth}`)
    expect(confirmationRes.statusCode).toBe(200)
    expect(confirmationRes.body.result.confirmed).toBeTruthy()
  })

  it("should not be able to register without a phone number ", async () => {
    const res = await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      email: "patrickbalkany@gmail.com",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.phone"])
  })

  it("should not be able to register with a bad phone number ", async () => {
    const res = await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      email: "patrickbalkany@gmail.com",
      phone_number: "33666666666",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.INVALID.phone"])
  })

  it("should not be able to register with no email", async () => {
    const res = await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      phone_number: "+33666666666",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.email"])
  })

  it("should not be able to register with a bad email", async () => {
    const res = await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      phone_number: "+33666666666",
      email: "hahahaha",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.INVALID.email"])
  })

  it("should not be able to register with no password", async () => {
    const res = await request(app).post("/user").send({
      phone_number: "+33666666666",
      email: "hello@kitty.com",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.password"])
  })

  it("should not be able to register with an invalid password", async () => {
    const res = await request(app).post("/user").send({
      password: "not a secure pw tbh",
      phone_number: "+33666666666",
      email: "hello@kitty.com",
      display_name: "Patoche Balkanoche",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.INVALID.password"])
  })

  it("should not be able to register with no display name", async () => {
    const res = await request(app).post("/user").send({
      password: "651541!##@$asdsadASD",
      phone_number: "+33666666666",
      email: "hello@kitttty.com",
    })
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.display_name"])
  })

  it("Should be able to login to a created account", async () => {
    await request(app).post("/user").send({
      password: "AS3cur3pw!!",
      email: "patrickbalkany@gmail.com",
      phone_number: "+33666666666",
      display_name: "Patoche Balkanoche",
    })
    const res = await request(app).post("/sign-in").send({
      email: "patrickbalkany@gmail.com",
      password: "AS3cur3pw!!",
    })
    expect(res.statusCode).toBe(200)
  })
})

describe("Forgotten password", () => {
  it("Should allow anyone to request a password reset through email", async () => {
    const res = await request(app)
      .post("/user/forgotten_password")
      .send({ email: "patrickbalkany@gmail.com" })

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("Should sent ok even if the email isnt tied to an account, as to not disclose if the email is in our db.", async () => {
    const res = await request(app)
      .post("/user/forgotten_password")
      .send({ email: "patrickbalkany@gmaaail.com" })

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("Should require an email address.", async () => {
    const res = await request(app).post("/user/forgotten_password")

    expect(res.statusCode).toBe(422)
  })

  it("Should require a valid email address.", async () => {
    const res = await request(app)
      .post("/user/forgotten_password")
      .send({ email: "patrickbalkany@gmaaail" })

    expect(res.statusCode).toBe(422)
  })
})
