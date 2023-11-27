import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import MaterialModel from "../src/db/models/MaterialModel"
import ProductModel from "../src/db/models/ProductModel"

const getProduct = (name = "Canapé 1") =>
  ProductModel.query().findOne({ name: name })

const getMaterial = (name = "Cuir") =>
  MaterialModel.query().findOne({ name: name })

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Material - GET", () => {
  it("Should be able to get materials", async () => {
    const res = await request(app).get("/material")

    expect(res.statusCode).toBe(200)
    expect(res.body.result.materials).toHaveLength(5)
  })

  it("Should be able to get material by id", async () => {
    const material = await getMaterial()
    const res = await request(app).get(`/material/${material.id}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.name).toBe("Cuir")
  })
})

describe("Material - POST", () => {
  it("guest should not be able to post new materials", async () => {
    const res = await request(app).post("/material").send({
      name: "Test Material",
    })
    expectInvalidAuth(res)
  })

  it("non admins should not be able to  add a new material with all informations correct", async () => {
    const res = await request(app)
      .post("/material")
      .send({
        name: "Test Material",
      })
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })

  it("admins should be able to add a new material with all informations correct", async () => {
    const res = await request(app)
      .post("/material")
      .send({
        name: "Test Material",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(201)
    expect(res.body.result.name).toBe("Test Material")
  })
  it("admins should not be able to add a new material without a name ", async () => {
    const res = await request(app)
      .post("/material")
      .send({})
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.material_name"])
  })

  it("admins should not be able to add a material with an invalid name ", async () => {
    const res = await request(app)
      .post("/material")
      .send({
        name: "Test Material__111",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.INVALID.material_name"])
  })

  it("admins should not be able to add a material with an already used name", async () => {
    const res = await request(app)
      .post("/material")
      .send({
        name: "Test Material",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(409)
    expect(res.body.error).toStrictEqual("E.ALREADY_EXISTS")
  })
})

describe("Material - DELETE", () => {
  it("admins should be able to delete a material with products linked to it", async () => {
    const newMaterial = await request(app)
      .post("/material")
      .send({ name: "plastique" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newMaterial.statusCode).toBe(201)
    const materialId = newMaterial.body.result.id

    const product = await getProduct()

    const materialLinkToProduct = await request(app)
      .patch(`/product/${product.id}/materials`)
      .send({ materialIds: [materialId] })
      .set("Authorization", `bearer ${adminToken}`)

    expect(materialLinkToProduct.statusCode).toBe(200)

    const res = await request(app)
      .delete("/material/" + materialId)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("admins should be able to delete a material without products linked to it", async () => {
    const newMaterial = await request(app)
      .post("/material")
      .send({ name: "plastique" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newMaterial.statusCode).toBe(201)
    const materialId = newMaterial.body.result.id

    const res = await request(app)
      .delete("/material/" + materialId)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })
})
