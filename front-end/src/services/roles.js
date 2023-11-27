export const getRolesService =
  ({ api }) =>
  async () => {
    return await api.get("/role")
  }

export const getRoleService =
  ({ api, errorHandler }) =>
  async (roleId) => {
    try {
      const { data } = await api.get(`/role/${roleId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createRoleService =
  ({ api, errorHandler }) =>
  async (name) => {
    try {
      return await api.post("/role", { name })
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateRoleService =
  ({ api, errorHandler }) =>
  async (roleId, name) => {
    try {
      const { data } = await api.patch(`/role/${roleId}`, {
        name,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteRoleService =
  ({ api, errorHandler }) =>
  async (roleId) => {
    try {
      const { data } = await api.delete(`/role/${roleId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
