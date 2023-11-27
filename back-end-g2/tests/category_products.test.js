import request from "supertest"
import app from "../app"
import {
  expect404,
  expectInsufficientPermission,
  expectInternalError,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers.js"
import ProductModel from "../src/db/models/ProductModel"
import CategoryModel from "../src/db/models/CategoryModel"

const getProduct = (name = "Canapé 1") =>
  ProductModel.query().findOne({ name: name })

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Category products - GET", () => {
  it("Should be able to get the list of categories", async () => {
    const category = await CategoryModel.query().findOne({ slug: "sofas" })
    const res = await request(app).get(`/category/${category.id}/products`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result).toHaveLength(1)
  })
})

describe("Category - PATCH", () => {
  it("Should not be able to link a product that is already linked to a category", async () => {
    const category = await CategoryModel.query()
      .withGraphFetched("products")
      .findOne({ slug: "sofas" })

    expect(category.products).toHaveLength(1)

    const product = await getProduct()

    const res = await request(app)
      .patch(`/category/${category.id}/products`)
      .send({
        productsId: [product.id],
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(409)
  })

  it("Should be able to link a product to a category", async () => {
    const category = await CategoryModel.query()
      .withGraphFetched("products")
      .findOne({ slug: "sofas" })

    expect(category.products).toHaveLength(1)

    const product = await getProduct("Table 1")

    const res = await request(app)
      .patch(`/category/${category.id}/products`)
      .send({
        productsId: [product.id],
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(res.statusCode).toBe(200)

    const updatedCategory = await CategoryModel.query()
      .withGraphFetched("products")
      .findOne({ slug: "sofas" })
    expect(updatedCategory.products.length).toBeGreaterThanOrEqual(2)
  })

  it("Shouldn't be able to add a new category if not logged in", async () => {
    const category = await CategoryModel.query().findOne({ slug: "sofas" })
    const res = await request(app)
      .patch(`/category/${category.id}/products`)
      .send({
        productsId: [1],
      })

    expectInvalidAuth(res)
  })

  it("Shouln't be able to add a new category if not logged in as admin", async () => {
    const category = await CategoryModel.query().findOne({ slug: "sofas" })

    const res = await request(app)
      .patch(`/category/${category.id}/products`)
      .send({
        productsId: [1],
      })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})

describe("Category products - DELETE", () => {
  it("Should be able to unlink a product to a category", async () => {
    const category = await CategoryModel.query()
      .withGraphFetched("products")
      .findOne({ slug: "sofas" })

    const originalLength = category.products.length

    const product = await getProduct("Table 1")

    const res = await request(app)
      .delete(`/category/${category.id}/products`)
      .send({
        productsId: [product.id],
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    const updatedCategory = await CategoryModel.query()
      .withGraphFetched("products")
      .findOne({ slug: "sofas" })
    expect(updatedCategory.products.length).toBeLessThan(originalLength)
  })

  it("Shouldn't be able to unlink a product to a category if not logged in", async () => {
    const category = await request(app)
      .post("/category")
      .send({
        name: "category_products delete not logged",
        image_url: "/image.png",
        description: "Description",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(category.statusCode).toBe(201)

    const product = await getProduct()

    const res = await request(app)
      .delete(`/category/${category.body.result.id}/products`)
      .send({ productsId: [product.id] })

    expectInvalidAuth(res)
  })

  it("Shouldn't be able to unlink a product to a category if not logged in as an admin", async () => {
    const category = await request(app)
      .post("/category")
      .send({
        name: "category_products delete not admin",
        image_url: "/image.png",
        description: "Description",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(category.statusCode).toBe(201)

    const product = await getProduct()

    const res = await request(app)
      .delete(`/category/${category.body.result.id}/products`)
      .send({ productsId: [product.id] })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Shouldn't be able to unlink a product to a category if category has no product", async () => {
    const category = await request(app)
      .post("/category")
      .send({
        name: "category_products delete category without product",
        image_url: "/image.png",
        description: "Description",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(category.statusCode).toBe(201)

    const product = await getProduct()

    const res = await request(app)
      .delete(`/category/${category.body.result.id}/products`)
      .send({ productsId: [product.id] })
      .set("Authorization", `bearer ${adminToken}`)

    expectInternalError(res, "E.CATEGORY.NO_PRODUCTS")
  })

  it("Shouldn't be able to unlink a product to a category if product does not exist", async () => {
    const category = await request(app)
      .post("/category")
      .send({
        name: "category_products delete product not exist",
        image_url: "/image.png",
        description: "Description",
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(category.statusCode).toBe(201)

    const product = await getProduct()

    const linkedProduct = await request(app)
      .patch(`/category/${category.body.result.id}/products`)
      .send({ productsId: [product.id] })
      .set("Authorization", `bearer ${adminToken}`)
    expect(linkedProduct.statusCode).toBe(200)

    const res = await request(app)
      .delete(`/category/${category.body.result.id}/products`)
      .send({ productsId: [0] })
      .set("Authorization", `bearer ${adminToken}`)

    expect404(res, "E.CATEGORY.PRODUCT_NOT_FOUND")
  })
})
