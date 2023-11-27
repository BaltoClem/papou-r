import createError from "http-errors"
import express from "express"
import path from "path"
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"

import bodyParser from "body-parser"
import multer from "multer"

import logger from "morgan"

import knex from "knex"
import cors from "cors"

import prepareRoutes from "./src/prepareRoutes.js"
import BaseModel from "./src/db/models/BaseModel.js"
import config from "./src/config.js"

const app = express()
const db = knex(config.db)

BaseModel.knex(db)

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const upload = multer({ dest: "tmp/" })

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
app.use(logger("dev"))
app.use((req, res, next) => {
  req.locals = {}

  next()
})
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf
    },
  })
)
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(express.static("public"))

prepareRoutes({ app, db, upload })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

export default app
