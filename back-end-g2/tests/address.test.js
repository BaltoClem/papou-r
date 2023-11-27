import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import UserModel from "../src/db/models/UserModel"
import AddressModel from "../src/db/models/AddressModel"

const adminToken = (await loginAsAdmin()).body.result
const adminInfos = await UserModel.query().findOne({ display_name: "admin" })
const userInfos = await UserModel.query().findOne({ display_name: "user" })
const userToken = (await loginAsUser()).body.result

describe("Address - POST", () => {
  it("guest should not be able to post new address", async () => {
    const res = await request(app).post("/address")
    expectInvalidAuth(res)
  })
  it("admins should be able to register with all informations correct", async () => {
    const res = await request(app)
      .post("/address")
      .send({
        fullname: "LastName firstName",
        street_name: "8 rue des oiseaux",
        zipcode: 77176,
        city: "Savigny-Le-Temple",
        country: "France",
        complement: "",
        order: 1,
        user_id: adminInfos.id,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(201)
  })

  it("admins should be able to add an address to any user", async () => {
    const res = await request(app)
      .post("/address")
      .send({
        fullname: "LastName firstName",
        street_name: "8 rue deeeeeeeeuh",
        zipcode: 91825,
        city: "Sav-Temple",
        country: "France",
        complement: "",
        order: 2,
        user_id: userInfos.id,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(201)
  })

  it("non admins should be able to add an address with all informations correct", async () => {
    const res = await request(app)
      .post("/address")
      .send({
        fullname: "LastName firstName",
        street_name: "8 rue Panait Istrati",
        zipcode: 77176,
        city: "Savigny-Le-Temple",
        country: "France",
        complement: "",
        order: 1,
        user_id: userInfos.id,
      })
      .set("Authorization", `bearer ${userToken}`)
    expect(res.statusCode).toBe(201)
  })

  it("non admins should not be able to add an address for someone else", async () => {
    const res = await request(app)
      .post("/address")
      .send({
        fullname: "LastName firstName",
        street_name: "8 rue Panait Istrati",
        zipcode: 77176,
        city: "Savigny-Le-Temple",
        country: "France",
        complement: "",
        order: 1,
        user_id: adminInfos.id,
      })
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
})

const userAddress = async () => {
  return await AddressModel.query().findOne({
    street_name: "8 rue Panait Istrati",
  })
}

const adminAddress = async () =>
  await AddressModel.query().findOne({ street_name: "8 rue des oiseaux" })

describe("Address - Patch", () => {
  it("Should not let a guest update someone's address", async () => {
    const res = await request(app)
      .patch(`/address/${(await userAddress()).id}`)
      .send({ city: "Lieusaint" })
    expectInvalidAuth(res)
  })

  it("Should let a user update their own address", async () => {
    const res = await request(app)
      .patch(`/address/${(await userAddress()).id}`)
      .send({ city: "Lieusaint" })
      .set("Authorization", `bearer ${userToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.city).toBe("Lieusaint")
  })
  it("Should let a user update someone else's address", async () => {
    const res = await request(app)
      .patch(`/address/${(await adminAddress()).id}`)
      .send({ city: "Lieusaint" })
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })

  it("Should let an admin update anyone's address", async () => {
    const res = await request(app)
      .patch(`/address/${(await userAddress()).id}`)
      .send({ city: "Brie" })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.city).toBe("Brie")
  })
})

describe("Address - GET", () => {
  it("Should not allow guest to query all addresses", async () => {
    const res = await request(app).get("/address")
    expectInvalidAuth(res)
  })
  it("Should not allow non admins to query all addresses", async () => {
    const res = await request(app)
      .get("/address")
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })

  it("Should  allow admins to query all addresses", async () => {
    const res = await request(app)
      .get("/address")
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.length).toBeGreaterThanOrEqual(2)
  })
})
