export const getUserRolesService =
  ({ api }) =>
  async (userId) => {
    return await api.get(`/user/${userId}/roles`)
  }

export const addRoleToUserService =
  ({ api, errorHandler }) =>
  async (userId, name) => {
    try {
      const { data } = await api.post(`/user/${userId}/roles`, { name })

      return [null, data]
    } catch (err) {
      errorHandler(err)
    }
  }

export const deleteRoleToUserService =
  ({ api, errorHandler }) =>
  async (userId, roleId) => {
    try {
      const { data } = await api.post(`/user/${userId}/roles/${roleId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
