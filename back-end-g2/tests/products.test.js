import request from "supertest"
import app from "../app"
import DimensionModel from "../src/db/models/DimensionModel"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import ProductModel from "../src/db/models/ProductModel"

const dimension = await DimensionModel.query().findOne({
  width: 100,
  height: 150,
})

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

describe("Product - GET", () => {
  it("Should be able to see a list of all products as a guest", async () => {
    const res = await request(app).get("/product")
    expect(res.statusCode).toBe(200)
    expect(res.body.result.products.length).toBeGreaterThanOrEqual(3)
  })

  it("Should be able to see a specific products as a guest", async () => {
    const product = await ProductModel.query().findOne({ name: "Chaise 1" })
    const res = await request(app).get(`/product/${product.id}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.result.name).toBe("Chaise 1")
  })

  it("should return products matching the search text for the name", async () => {
    const searchText = "chaise"

    const res = await request(app).get(`/product?searchText=${searchText}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(1)
    expect(res.body.result.products[0].name).toBe("Chaise 1")
  })

  it("should return products matching the search text for the description", async () => {
    const searchText = "Une commode belle et utile"

    const res = await request(app).get(`/product?searchText=${searchText}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(1)
    expect(res.body.result.products[0].name).toBe("Commode 1")
  })

  it("should return products with a minimum price", async () => {
    const minPrice = 200

    const res = await request(app).get(`/product?minPrice=${minPrice}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(2)
    expect(res.body.result.products[0].name).toBe("Table 1")
    expect(res.body.result.products[1].name).toBe("Canapé 1")
  })

  it("should return products with a maximum price", async () => {
    const maxPrice = 100

    const res = await request(app).get(`/product?maxPrice=${maxPrice}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(1)
    expect(res.body.result.products[0].name).toBe("Chaise 1")
  })

  it("should return products within the specified price range", async () => {
    const minPrice = 60
    const maxPrice = 150

    const res = await request(app).get(
      `/product?minPrice=${minPrice}&maxPrice=${maxPrice}`
    )

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(2)
    expect(res.body.result.products[0].name).toBe("Chaise 1")
    expect(res.body.result.products[1].name).toBe("Table 2")
  })

  it("should return products in stock only when 'inStockOnly' is set to true", async () => {
    const inStockOnly = true

    const res = await request(app).get(`/product?inStockOnly=${inStockOnly}`)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.result.products)).toBe(true)
    expect(res.body.result.products.length).toBeLessThan(10)

    res.body.result.products.forEach((product) => {
      expect(product.stock).toBeGreaterThan(0)
    })
  })

  it("should return products sorted by price in ascending order", async () => {
    const sortBy = "price"
    const sortOrder = "asc"

    const res = await request(app).get(
      `/product?sortBy=${sortBy}&sortOrder=${sortOrder}`
    )

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.result.products)).toBe(true)

    let prevPrice = null
    res.body.result.products.forEach((product, index) => {
      if (index > 0) {
        expect(product.price).toBeGreaterThanOrEqual(prevPrice)
      }

      prevPrice = product.price
    })
  })

  it("should return products sorted by createdAt in descending order", async () => {
    const sortBy = "createdAt"
    const sortOrder = "desc"

    const res = await request(app).get(
      `/product?sortBy=${sortBy}&sortOrder=${sortOrder}`
    )

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.result.products)).toBe(true)

    let prevCreatedAt = new Date(
      res.body.result.products[0].createdAt
    ).getTime()

    res.body.result.products.slice(1).forEach((product) => {
      const currentCreatedAt = new Date(product.createdAt).getTime()
      expect(currentCreatedAt).toBeLessThanOrEqual(prevCreatedAt)
      prevCreatedAt = currentCreatedAt
    })
  })

  it("should return products with the specified limit", async () => {
    const limit = 2

    const res = await request(app).get(`/product?limit=${limit}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(limit)
    expect(res.body.result.products[0].name).toBe("Chaise 1")
    expect(res.body.result.products[1].name).toBe("Table 1")
  })

  it("should return products with the specified limit and page", async () => {
    const limit = 2
    const page = 2

    const res = await request(app).get(`/product?limit=${limit}&page=${page}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.products).toHaveLength(limit)
    expect(res.body.result.products[0].name).toBe("Table 2")
    expect(res.body.result.products[1].name).toBe("Table 3")
  })
})

describe("Product - POST", () => {
  it("should not be able to add a new product if not admin", async () => {
    const res = await request(app)
      .post("/product")
      .send({
        name: "My Product Name",
        description: "Description",
        price: 10,
        stock: 12,
        dimension_id: dimension.id,
      })
      .set("Authorization", `Bearer ${userToken}`)

    expectInsufficientPermission(res)
  })

  it("should not be able to add a new product as a guest", async () => {
    const res = await request(app).post("/product").send({
      name: "My Product Name",
      description: "Description",
      price: 10,
      stock: 12,
      dimension_id: dimension.id,
    })

    expectInvalidAuth(res)
  })

  it("should be able to add a new product with no categories", async () => {
    const res = await request(app)
      .post("/product")
      .send({
        name: "My Product Name",
        description: "Description",
        price: 10,
        stock: 12,
        dimension_id: dimension.id,
      })
      .set("Authorization", `bearer ${adminToken}`)

    const product = res.body.result.product
    expect(res.statusCode).toBe(201)
    expect(product.name).toBe("My Product Name")
    expect(product.description).toBe("Description")
    expect(product.price).toBe(10)
    expect(product.stock).toBe(12)
    expect(product.dimension_id).toBe(dimension.id)
  })

  it("should not be able to add a new product without an product name", async () => {
    const res = await request(app)
      .post("/product")
      .send({
        description: "Description",
        price: 10,
        stock: 12,
        dimension_id: dimension.id,
      })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(422)
    expect(res.body.error).toStrictEqual(["E.MISSING.product_name"])
  })
})

describe("PRODUCT - PATCH", () => {
  it("Should allow admins to change the name of a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "My Product Name",
    })

    const res = await request(app)
      .patch(`/product/${product.id}`)
      .send({ name: "My new Product Name" })
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.name).toBe("My new Product Name")
  })

  it("Should not allow guest to change the name of a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "My new Product Name",
    })
    const res = await request(app)
      .patch(`/product/${product.id}`)
      .send({ name: "a product" })

    expectInvalidAuth(res)
  })

  it("Should not allow users to change the name of a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "My new Product Name",
    })

    const res = await request(app)
      .patch(`/product/${product.id}`)
      .send({ name: "a product" })
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})

describe("PRODUCT - DELETE", () => {
  it("Should allow admins to delete a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "My new Product Name",
    })

    const res = await request(app)
      .delete(`/product/${product.id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result).toBe("OK")
  })

  it("Should not allow guest to delete a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "Chaise 1",
    })

    const res = await request(app).delete(`/product/${product.id}`)
    expectInvalidAuth(res)
  })

  it("Should not allow users to  delete a product", async () => {
    const product = await ProductModel.query().findOne({
      name: "Chaise 1",
    })

    const res = await request(app)
      .delete(`/product/${product.id}`)
      .set("Authorization", `bearer ${userToken}`)
    expectInsufficientPermission(res)
  })
})
