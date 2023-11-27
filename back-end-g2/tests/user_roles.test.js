import request from "supertest"
import app from "../app"
import UserModel from "../src/db/models/UserModel.js"
import {
  expect404,
  expect409,
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import RoleModel from "../src/db/models/RoleModel"

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result
const user = await UserModel.query().findOne({ display_name: "user" })
const adminUser = await UserModel.query().findOne({ display_name: "admin" })

describe("User roles - GET", () => {
  it("Should not let user that aren't logged in get the role list of any users.", async () => {
    const res = await request(app).get(`/user/${adminUser.id}/roles`)
    expectInvalidAuth(res)
  })

  it("Should not let users that aren't admin to get the role list of any users", async () => {
    const res = await request(app)
      .get(`/user/${adminUser.id}/roles`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should allow admins to get the role list of any user", async () => {
    const res = await request(app)
      .get(`/user/${adminUser.id}/roles`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThan(3)
  })
})

describe("User roles - POST", () => {
  it("Should not let user that aren't logged in change the role list of any users.", async () => {
    const res = await request(app).post(`/user/${user.id}/roles`).send({
      name: "dummy",
    })
    expectInvalidAuth(res)
  })

  it("Should not let users that aren't admin to change the role list of any users", async () => {
    const res = await request(app)
      .post(`/user/${user.id}/roles`)
      .send({
        name: "dummy",
      })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should not let users that are admin to add a role that a user already has", async () => {
    const res = await request(app)
      .post(`/user/${user.id}/roles`)
      .send({
        name: "user",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect409(res, "E.USER_ALREADY_HAS_ROLE")
  })

  it("Should not let users that are admin to add a role that doens't exists to a user", async () => {
    const res = await request(app)
      .post(`/user/${user.id}/roles`)
      .send({
        name: "notarealrole",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect404(res, "E.ROLE_NOT_FOUND")
  })

  it("Should let admins add roles to a user", async () => {
    const res = await request(app)
      .post(`/user/${user.id}/roles`)
      .send({
        name: "super_user",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(201)
  })
})

describe("User roles - DELETE", () => {
  it("Should not let users that aren't logged in to delete a user's role", async () => {
    const user = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "admin" })
    const res = await request(app).delete(
      `/user/${user.id}/roles/${user.roles[0].id}`
    )
    expectInvalidAuth(res)
  })

  it("Should not let users that aren't admin to delete a user's role", async () => {
    const user = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "admin" })
    const res = await request(app)
      .delete(`/user/${user.id}/roles/${user.roles[0].id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Should not let admin delete roles if the user doesn't have the role", async () => {
    const user = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "user" })

    const adminRole = await RoleModel.query().findOne({ name: "admin" })
    const res = await request(app)
      .delete(`/user/${user.id}/roles/${adminRole.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect404(res, "E.USER_ROLES_FALSE")
  })

  it('Should not let amdin delete the "user" role.', async () => {
    const user = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "user" })

    const userRole = await RoleModel.query().findOne({ name: "user" })
    const res = await request(app)
      .delete(`/user/${user.id}/roles/${userRole.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe("E.CANNOT_DELETE_ROLE")
  })

  it("Should let the admin delete an user's role", async () => {
    const thisUser = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "user" })

    expect(thisUser.roles).toHaveLength(2)

    const userRole = await RoleModel.query().findOne({ name: "super_user" })

    const res = await request(app)
      .delete(`/user/${user.id}/roles/${userRole.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    const updatedUser = await UserModel.query()
      .withGraphFetched("roles")
      .findOne({ display_name: "user" })

    expect(res.statusCode).toBe(200)
    expect(updatedUser.roles).toHaveLength(1)
  })
})
