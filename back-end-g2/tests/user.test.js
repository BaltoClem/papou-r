import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import UserModel from "../src/db/models/UserModel"

const user = await UserModel.query().findOne({ display_name: "user" })
const user2 = await UserModel.query().findOne({ display_name: "admin" })
const userToken = (await loginAsUser()).body.result
const adminToken = (await loginAsAdmin()).body.result

const restoreUserName = async () =>
  await request(app)
    .patch(`/user/${user.id}`)
    .set("Authorization", `bearer ${adminToken}`)
    .send({ display_name: "user" })

describe("User - GET", () => {
  it("Should be able to get the list of users as admin", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
  })

  it("Should not able to get the list of users as user", async () => {
    const res = await request(app)
      .get("/user")
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should not able to get the list of users as giest", async () => {
    const res = await request(app).get("/user")

    expectInvalidAuth(res)
  })

  it("Should not able to get the details of a user as guest", async () => {
    const res = await request(app).get(`/user/${user.id}`)

    expectInvalidAuth(res)
  })

  it("Should not able to get the details of a user if they're neither said user nor admin", async () => {
    const res = await request(app)
      .get(`/user/${user2.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should not able to get the details of self", async () => {
    const res = await request(app)
      .get(`/user/${user.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
  })

  it("Should not able to get the details of anyone as admin", async () => {
    const res = await request(app)
      .get(`/user/${user.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
  })
})

describe("User - PATCH", () => {
  it("Should not be able to update a user as a guest", async () => {
    const res = await request(app)
      .patch(`/user/${user.id}`)
      .send({ display_name: "NewName" })

    expectInvalidAuth(res)
  })

  it("Should not be able to update a user without proper authorization", async () => {
    const res = await request(app)
      .patch(`/user/${user2.id}`)
      .set("Authorization", `bearer ${userToken}`)
      .send({ display_name: "NewName" })

    expectInsufficientPermission(res)
  })

  it("Should be able to update a user as the user themselves", async () => {
    const res = await request(app)
      .patch(`/user/${user.id}`)
      .send({ display_name: "NewName" })
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.display_name).toBe("NewName")

    await restoreUserName()
  })

  it("Should be able to update a user as an admin", async () => {
    const res = await request(app)
      .patch(`/user/${user.id}`)
      .send({ display_name: "NewName" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.display_name).toBe("NewName")
    await restoreUserName()
  })
})

describe("User - DELETE", () => {
  it("Should not be able to delete a user as a guest", async () => {
    const res = await request(app).delete(`/user/${user.id}`)

    expectInvalidAuth(res)
  })

  it("Should not be able to delete that isn't self, if not admin.", async () => {
    const res = await request(app)
      .delete(`/user/${user2.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should  be able to delete themselves", async () => {
    const res = await request(app)
      .delete(`/user/${user.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("Should be able to delete a user as an admin", async () => {
    const res = await request(app)
      .delete(`/user/${user.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })
})
