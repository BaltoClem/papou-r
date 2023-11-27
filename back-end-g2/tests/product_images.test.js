import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import ImageModel from "../src/db/models/ImageModel"
import ProductModel from "../src/db/models/ProductModel"

const getProduct = (name = "Canapé 1") =>
  ProductModel.query().findOne({ name: name })

const getImage = (
  url = "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair1.png"
) =>
  ImageModel.query().findOne({
    url: url,
  })

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Product images - GET", () => {
  it("Should be able to get images of a product", async () => {
    const product = await getProduct()
    const res = await request(app).get(`/product/${product.id}/images`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toHaveLength(1)
  })
})

describe("Product images - PATCH", () => {
  it("Should be able to add images to a product", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const imageTable = await getImage(
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table1.png"
    )
    const images = [imageChair.id, imageTable.id]
    const res = await request(app)
      .patch(`/product/${product.id}/images`)
      .send({ imageIds: images })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
  })

  it("Should not be able to add images to a product if not logged in", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const imageTable = await getImage(
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table1.png"
    )
    const images = [imageChair.id, imageTable.id]
    const res = await request(app)
      .patch(`/product/${product.id}/images`)
      .send({ imageIds: images })

    expectInvalidAuth(res)
  })

  it("Should not be able to add images to a product if not logged in as admin", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const imageTable = await getImage(
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table1.png"
    )
    const images = [imageChair.id, imageTable.id]
    const res = await request(app)
      .patch(`/product/${product.id}/images`)
      .send({ imageIds: images })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})

describe("Product images - DELETE", () => {
  it("Should be able to delete images to a product", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const imageTable = await getImage(
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table1.png"
    )
    const res = await request(app)
      .delete(`/product/${product.id}/images/${imageChair.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    const resBis = await request(app)
      .delete(`/product/${product.id}/images/${imageTable.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
    expect(resBis.statusCode).toBe(200)
    expect(resBis.body.result).toBe("OK")
  })

  it("Should not be able to delete images to a product if not logged in", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const res = await request(app).delete(
      `/product/${product.id}/images/${imageChair.id}`
    )

    expectInvalidAuth(res)
  })

  it("Should not be able to delete images to a product if not logged in as admin", async () => {
    const product = await getProduct()
    const imageChair = await getImage()
    const res = await request(app)
      .delete(`/product/${product.id}/images/${imageChair.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})
