import request from "supertest"
import app from "../app"
import {
  expect409,
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers.js"

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Role - GET", () => {
  it("Should allow anyone to see the list of roles", async () => {
    const res = await request(app).get("/role")
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThan(3)
  })

  it("Should be able to get information on a single role", async () => {
    const roleList = (await request(app).get("/role")).body.result
    roleList.forEach(async ({ id }) => {
      const res = await request(app).get(`/role/${id}`)
      expect(res.statusCode).toBe(200)
    })
  })
})

describe("Role - POST", () => {
  it("should be able to add a new role", async () => {
    const res = await request(app)
      .post("/role")
      .send({
        name: "marketing",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(201)
    expect(res.body.result.name).toBe("marketing")
  })

  it("guest shouldn't be able to add a new role if not logged in as admin", async () => {
    const res = await request(app).post("/role").send({
      name: "notanadmin",
    })
    expectInvalidAuth(res)
  })
  it("shouldn't be able to create a new role if not logged as an admin", async () => {
    const res = await request(app)
      .post("/role")
      .send({
        name: "userrole",
      })
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })

  it("Shouldn't be able to post two roles with the same name", async () => {
    const res = await request(app)
      .post("/role")
      .send({
        name: "tech",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(201)
    expect(res.body.result.name).toBe("tech")

    const secondres = await request(app)
      .post("/role")
      .send({
        name: "tech",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect409(secondres)
  })
})

describe("Roles - PATCH", () => {
  it("should not be able to edit a role if not logged in", async () => {
    const role = (await request(app).get("/role")).body.result.filter(
      (role) => role.name === "dummy"
    )[0]

    const res = await request(app).patch(`/role/${role.id}`).send({
      name: "patchedByGuest",
    })

    expectInvalidAuth(res)
  })

  it("should not be able to edit a role if not logged in as admin", async () => {
    const role = (await request(app).get("/role")).body.result.filter(
      (v) => v.name === "dummy"
    )[0]

    const res = await request(app)
      .patch(`/role/${role.id}`)
      .send({
        name: "patchedByUser",
      })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("should not be able to edit a role with a name already used for another role", async () => {
    const role = (await request(app).get("/role")).body.result.filter(
      (v) => v.name === "dummy"
    )[0]

    const res = await request(app)
      .patch(`/role/${role.id}`)
      .send({
        name: "admin",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect409(res)
  })

  it("Should be able to edit the name of a role if logged in as an admin", async () => {
    const role = (await request(app).get("/role")).body.result.filter(
      (role) => role.name === "dummy"
    )[0]

    const res = await request(app)
      .patch(`/role/${role.id}`)
      .send({
        name: "dummy2",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.name).toBe("dummy2")
  })
})

describe("Roles - DELETE", () => {
  it("should not be able to delete a role if the user isn't logged in", async () => {
    const newRole = await request(app)
      .post("/role")
      .send({
        name: "notLogged",
      })
      .set("Authorization", `bearer ${adminToken}`)

    const id = newRole.body.result.id

    const res = await request(app).delete(`/role/${id}`)
    expectInvalidAuth(res)
  })

  it("should not be able to delete a role if the user isn't an admin", async () => {
    const newRole = await request(app)
      .post("/role")
      .send({
        name: "notAdminDelete",
      })
      .set("Authorization", `bearer ${adminToken}`)

    const id = newRole.body.result.id

    const res = await request(app)
      .delete(`/role/${id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("should  be able to delete a role if the user is an admin", async () => {
    const newRole = await request(app)
      .post("/role")
      .send({
        name: "adminToDelete",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newRole.statusCode).toBe(201)
    const id = newRole.body.result.id

    const initialRoleLength = (await request(app).get("/role")).body.result
      .length

    const res = await request(app)
      .delete(`/role/${id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")

    const newRoleLength = (await request(app).get("/role")).body.result.length
    expect(initialRoleLength).toBeGreaterThan(newRoleLength)
  })
})
