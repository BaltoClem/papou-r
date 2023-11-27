import { faker } from "@faker-js/faker"
import hashPassword from "../src/db/methods/hashPassword.js"

export const generateFakePhoneNumber = () => faker.phone.number("+336########")
export const randomId = () => faker.number.int()
export const randomUUID = () => faker.string.uuid()
export async function generateRandomUser() {
  const [passwordHash, passwordSalt] = await hashPassword(
    faker.internet.password()
  )

  return {
    display_name: faker.person.fullName(),
    email: faker.internet.email(),
    password_hash: passwordHash,
    password_salt: passwordSalt,
    phone_number: generateFakePhoneNumber(),
  }
}

export function generateXProductChair(dimensionId) {
  return {
    name: "Generate Chair",
    price: faker.number.int({ min: 10, max: 1000 }),
    description: faker.string.alpha(),
    stock: faker.number.int({ min: 0, max: 100 }),
    dimension_id: dimensionId,
  }
}

export function generateXCategoryChair() {
  return {
    name: "Our chairs",
    slug: `chairs${faker.string.alphanumeric(5)}`,
    image_url:
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair6.jpg",
    description: faker.string.alphanumeric(),
  }
}

export function generateCategoryProductsChairs(productId, categoryId) {
  return {
    product_id: productId,
    category_id: categoryId,
  }
}

export async function getGenerateProducts(knex) {
  return await knex.from("products").where({ name: "Generate Chair" })
}

export function generateProductMaterialsChairs(productId, materialId) {
  return {
    product_id: productId,
    material_id: materialId,
  }
}

export function generateProductImagesChair6(productId, imageId) {
  return {
    product_id: productId,
    image_id: imageId,
  }
}
