export const adminOrSelfAuth = (res, user, idParam) => {
  if (!user) {
    insufficientPermissionError(res, "E.INVALID.AUTH")
  }

  if (user.id === parseInt(idParam)) {
    return true
  }

  if (!isUserAdmin(user)) {
    insufficientPermissionError(res)

    return
  }

  return true
}

export const isUserAdmin = (user) => {
  const userRoles = user.roles

  if (
    !userRoles ||
    userRoles.length === 0 ||
    !userRoles.some(({ name }) => name === "admin")
  ) {
    return false
  }

  return true
}

export const alreadyExistsError = (res, err = "E.ALREADY_EXISTS") => {
  res.status(409).send({ error: err })
}

export const insufficientPermissionError = (
  res,
  err = "E.INSUFFICIENT_PERMISSION"
) => {
  res.status(403).send({ error: err })
}

export const internalError = (res, err = "E.INTERNAL_ERROR") => {
  res.status(500).send({ error: err })
}
export const notFoundError = (res, err = "E.NOT_FOUND") => {
  res.status(404).send({ error: err })
}

export const uploadError = (res, err = "E.UPLOAD_ERROR") => {
  res.status(500).send({ error: err })
}

export const conflictsError = (res, err = "E.CONFLICTS") => {
  res.status(409).send({ error: err })
}
