import request from "supertest"
import app from "../app"
import {
  expect409,
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers.js"
import ProductCategoriesModel from "../src/db/models/ProductCategoriesModel"

const DESCRIPTION = "description"
const IMAGE_URL = "/image.png"

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Category - GET", () => {
  it("Should be able to get the list of categories", async () => {
    const res = await request(app).get("/category")
    expect(res.statusCode).toBe(200)
    expect(res.body.result.categories.length).toBeGreaterThanOrEqual(3)
  })

  it("Should be able to get information on a single category as an admin", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category get single",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)
    expect(newCategory.statusCode).toBe(201)

    const res = await request(app).get(
      `/category/${newCategory.body.result.id}`
    )
    expect(res.statusCode).toBe(200)
    expect(res.body.result.name).toBe("category get single")
    expect(res.body.result.slug).toBe("category-get-single")
    expect(res.body.result.image_url).toBe(IMAGE_URL)
    expect(res.body.result.description).toBe(DESCRIPTION)
  })
})

describe("Category - POST", () => {
  it("Should be able to add a new category", async () => {
    const res = await request(app)
      .post("/category")
      .send({
        name: "category post ok",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    const category = res.body.result
    expect(res.statusCode).toBe(201)
    expect(category.name).toBe("category post ok")
    expect(category.slug).toBe("category-post-ok")
    expect(category.image_url).toBe(IMAGE_URL)
    expect(category.description).toBe(DESCRIPTION)
  })

  it("Shouldn't be able to add a new category if not logged in", async () => {
    const res = await request(app).post("/category").send({
      name: "category post not logged",
      image_url: IMAGE_URL,
      description: DESCRIPTION,
    })

    expectInvalidAuth(res)
  })

  it("Shouln't be able to add a new category if not logged in as admin", async () => {
    const res = await request(app)
      .post("/category")
      .send({
        name: "category post not admin",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Shouldn't be able to create a new category with a slug already in use", async () => {
    const categoryAlreadyExist = await request(app)
      .post("/category")
      .send({
        name: "category post slug already use",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(categoryAlreadyExist.statusCode).toBe(201)

    const res = await request(app)
      .post("/category")
      .send({
        name: "category post already use",
        slug: "category-post-slug-already-use",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect409(res)
  })

  it("Should add a new category without specifying slug", async () => {
    const res = await request(app)
      .post("/category")
      .send({
        name: "category post slug auto",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    const category = res.body.result
    expect(res.statusCode).toBe(201)
    expect(category.name).toBe("category post slug auto")
    expect(category.slug).toBe("category-post-slug-auto")
    expect(category.image_url).toBe(IMAGE_URL)
    expect(category.description).toBe(DESCRIPTION)
  })
})

describe("Category - PATCH", () => {
  it("Should be able to edit a new category", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category patch ok",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const res = await request(app)
      .patch(`/category/${newCategory.body.result.id}`)
      .send({
        slug: "le-category-patch-ok",
      })
      .set("Authorization", `bearer ${adminToken}`)

    const category = res.body.result
    expect(res.statusCode).toBe(200)
    expect(category.name).toBe("category patch ok")
    expect(category.slug).toBe("le-category-patch-ok")
    expect(category.image_url).toBe(IMAGE_URL)
    expect(category.description).toBe(DESCRIPTION)
  })

  it("Shouldn't be able to edit a new category if not logged in", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category patch not logged",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const res = await request(app)
      .patch(`/category/${newCategory.body.result.id}`)
      .send({
        slug: "le-category-patch-not-logged",
      })

    expectInvalidAuth(res)
  })

  it("Shouln't be able to edit a new category if not logged in as admin", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category patch not admin",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const res = await request(app)
      .patch(`/category/${newCategory.body.result.id}`)
      .send({
        slug: "le-category-patch-not-admin",
      })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Shouldn't be able to edit a new category with a slug already in use", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category patch first slug",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const newCategoryToUpdate = await request(app)
      .post("/category")
      .send({
        name: "category patch slug already use",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategoryToUpdate.statusCode).toBe(201)

    const res = await request(app)
      .patch(`/category/${newCategoryToUpdate.body.result.id}`)
      .send({
        slug: "category-patch-first-slug",
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect409(res)
  })
})

describe("Category - DELETE", () => {
  it("Should be able to delete a category without any products", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category delete ok",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)
    const initialCategoryLength = (await request(app).get("/category")).body
      .result.categories.length

    const res = await request(app)
      .delete(`/category/${newCategory.body.result.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)

    const newCategoryLength = (await request(app).get("/category")).body.result
      .categories.length
    expect(initialCategoryLength).toBeGreaterThan(newCategoryLength)
  })

  it("Should be able to delete a category with products and rows in category__products table that concern it", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category delete ok with products",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)
    const initialCategoryLength = (await request(app).get("/category")).body
      .result.categories.length
    const initialProductCategoriesLength = (
      await ProductCategoriesModel.query()
    ).length

    const res = await request(app)
      .delete(`/category/${newCategory.body.result.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)

    const newCategoryLength = (await request(app).get("/category")).body.result
      .categories.length
    const newProductCategoriesLength = (await ProductCategoriesModel.query())
      .length

    expect(initialCategoryLength).toBeGreaterThan(newCategoryLength)
    expect(initialProductCategoriesLength).toBeGreaterThanOrEqual(
      newProductCategoriesLength
    )
  })

  it("Shouldn't be able to delete a category if not logged in as admin", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category delete not admin",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const res = await request(app)
      .delete(`/category/${newCategory.body.result.id}`)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("Shouldn't be able to delete a category if not logged in", async () => {
    const newCategory = await request(app)
      .post("/category")
      .send({
        name: "category delete not logged",
        image_url: IMAGE_URL,
        description: DESCRIPTION,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(newCategory.statusCode).toBe(201)

    const res = await request(app).delete(`/category/${newCategory.id}`)

    expectInvalidAuth(res)
  })
})
