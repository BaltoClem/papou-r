import dotenv from "dotenv"
import { resolve } from "node:path"
import request from "supertest"
import app from "../app"

dotenv.config({ path: resolve(".env") })
const adminPassword = process.env.ADMIN_PASSWORD
const userPassword = process.env.USER_PASSWORD

export const loginAsAdmin = async () => {
  return await request(app).post("/sign-in").send({
    email: "admin@airneis.com",
    password: adminPassword,
  })
}

export const loginAsWanted = async (email, password) => {
  return await request(app).post("/sign-in").send({
    email: email,
    password: password,
  })
}

export const loginAsUser = async () => {
  return await request(app).post("/sign-in").send({
    email: "user@airneis.com",
    password: userPassword,
  })
}

export const expectInvalidAuth = (res, errorMsg = "E.INVALID.AUTH") => {
  expect(res.statusCode).toBe(403)
  expect(res.body.error).toBe(errorMsg)
}

export const expectInsufficientPermission = (
  res,
  errorMsg = "E.INSUFFICIENT_PERMISSION"
) => {
  expect(res.statusCode).toBe(403)
  expect(res.body.error).toBe(errorMsg)
}
export const expect404 = (res, errorMsg = "E.NOT_FOUND") => {
  expect(res.statusCode).toBe(404)
  expect(res.body.error).toBe(errorMsg)
}

export const expect409 = (res, errorMsg = "E.ALREADY_EXISTS") => {
  expect(res.statusCode).toBe(409)
  expect(res.body.error).toBe(errorMsg)
}

export const expectInternalError = (res, errorMsg = "E.INTERNAL_ERROR") => {
  expect(res.statusCode).toBe(500)
  expect(res.body.error).toBe(errorMsg)
}
