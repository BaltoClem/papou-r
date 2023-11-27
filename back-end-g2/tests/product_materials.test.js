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
  MaterialModel.query().findOne({
    name: name,
  })

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Product materials - GET", () => {
  it("Should be able to get materials of a product", async () => {
    const product = await getProduct("Commode 1")
    const res = await request(app).get(`/product/${product.id}/materials`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.product_materials).toHaveLength(2)
  })
})

describe("Product images - PATCH", () => {
  it("Should be able to add materials to a product", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const materialChene = await getMaterial("Chêne")
    const materials = [materialCuir.id, materialChene.id]
    const res = await request(app)
      .patch(`/product/${product.id}/materials`)
      .send({ materialIds: materials })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
  })

  it("Should not be able to add materials to a product if not logged in", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const materialChene = await getMaterial("Chêne")
    const materials = [materialCuir.id, materialChene.id]
    const res = await request(app)
      .patch(`/product/${product.id}/materials`)
      .send({ materialIds: materials })

    expectInvalidAuth(res)
  })

  it("Should not be able to add materials to a product if not logged in as admin", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const materialChene = await getMaterial("Chêne")
    const materials = [materialCuir.id, materialChene.id]
    const res = await request(app)
      .patch(`/product/${product.id}/materials`)
      .send({ materialIds: materials })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})

describe("Product images - DELETE", () => {
  it("Should be able to delete materials to a product", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const materialChene = await getMaterial("Chêne")
    const res = await request(app)
      .delete(`/product/${product.id}/images/${materialCuir.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    const resBis = await request(app)
      .delete(`/product/${product.id}/images/${materialChene.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
    expect(resBis.statusCode).toBe(200)
    expect(resBis.body.result).toBe("OK")
  })

  it("Should not be able to delete images to a product if not logged in", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const res = await request(app).delete(
      `/product/${product.id}/images/${materialCuir.id}`
    )

    expectInvalidAuth(res)
  })

  it("Should not be able to delete images to a product if not logged in as admin", async () => {
    const product = await getProduct()
    const materialCuir = await getMaterial()
    const res = await request(app)
      .delete(`/product/${product.id}/images/${materialCuir.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})
