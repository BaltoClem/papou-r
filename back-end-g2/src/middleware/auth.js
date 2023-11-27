import jsonwebtoken from "jsonwebtoken"
import config from "../config.js"
import { insufficientPermissionError } from "../../helpers/reponseHelpers.js"
import UserModel from "../db/models/UserModel.js"

export function decodeJWTFromHeader(req) {
  const jwt = req.headers.authorization?.slice(7)

  try {
    const { payload } = jsonwebtoken.verify(jwt, config.security.jwt.secret)

    return payload
  } catch (err) {
    if (err instanceof jsonwebtoken.JsonWebTokenError) {
      return false
    }
  }
}

export const softAuth = async (req, res, next) => {
  const decodedJWT = decodeJWTFromHeader(req)

  if (!req.headers.uuid) {
    res.status(422).send({ error: "E.MISSING_UUID" })

    return false
  }

  if (decodedJWT) {
    req.locals.session = decodedJWT
  }

  next()
}

export const auth = async (req, res, next, returningUser = false) => {
  const decodedJWT = decodeJWTFromHeader(req)

  if (!decodedJWT) {
    insufficientPermissionError(res, "E.INVALID.AUTH")

    return false
  }

  req.locals.session = decodedJWT

  const userId = decodedJWT.user.id

  const user = await UserModel.query()
    .withGraphFetched("roles")
    .findById(userId)

  if (!user) {
    insufficientPermissionError(res, "E.INVALID.AUTH")

    return
  }

  if (returningUser) {
    return user
  }

  next()
}

export const adminAuth = async (req, res, next) => {
  const loggedUser = await auth(req, res, next, true)

  if (!loggedUser) {
    return
  }

  const userRoles = loggedUser.roles

  if (
    !userRoles ||
    userRoles.length === 0 ||
    !userRoles.some(({ name }) => name === "admin")
  ) {
    insufficientPermissionError(res)

    return
  }

  next()
}
