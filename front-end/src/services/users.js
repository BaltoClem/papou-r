export const getUserService =
  ({ api, errorHandler }) =>
  async (userId) => {
    try {
      const { data } = await api.get(`/user/${userId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getUsersService =
  ({ api, errorHandler }) =>
  async (limit, page) => {
    try {
      const data = await api.get(`/user?limit=${limit}&page=${page}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateUserService =
  ({ api, errorHandler }) =>
  async ({ userId, displayName, email, password, phoneNumber }) => {
    try {
      const { data } = await api.patch(`/user/${userId}`, {
        display_name: displayName,
        email,
        password,
        phone_number: phoneNumber,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updatePasswordUserService =
  ({ api, errorHandler }) =>
  async (password) => {
    try {
      const { data } = await api.patch(`/user/forgotten_password`, {
        password,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteUserService =
  ({ api, errorHandler }) =>
  async (userId) => {
    try {
      const { data } = await api.delete(`/user/${userId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const confirmUserService =
  ({ api, errorHandler }) =>
  async () => {
    try {
      const { data } = await api.patch(`/user/confirmation`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const forgottenPasswordUserService =
  ({ api, errorHandler }) =>
  async (email) => {
    try {
      const { data } = await api.post("/user/forgotten_password", {
        email: email,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
