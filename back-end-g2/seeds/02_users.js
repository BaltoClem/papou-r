import hashPassword from "../src/db/methods/hashPassword.js"

import dotenv from "dotenv"
import { resolve } from "node:path"
import { generateRandomUser } from "../helpers/fakerHelpers.js"
import config from "../src/config.js"

dotenv.config({ path: resolve(".env") })
const adminPassword = process.env.ADMIN_PASSWORD
const userPassword = process.env.USER_PASSWORD

const [adminHash, adminSalt] = await hashPassword(adminPassword)
const [userHash, userSalt] = await hashPassword(userPassword)

const extraUsers = await Promise.all(
  new Array(config.seedsize).fill(0).map(async () => {
    return await generateRandomUser()
  })
)

export const seed = async (knex) => {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        {
          display_name: "admin",
          email: "admin@airneis.com",
          password_hash: adminHash,
          password_salt: adminSalt,
          phone_number: "+33663033636",
          confirmed: true,
        },
        {
          display_name: "user",
          email: "user@airneis.com",
          password_hash: userHash,
          password_salt: userSalt,
          phone_number: "+33663033636",
          confirmed: true,
        },
        ...extraUsers,
      ])
    })
}
