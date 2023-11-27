export const getMaterialsService =
  ({ api }) =>
  async (limit, page) => {
    return await api.get(`/material?limit=${limit}&page=${page}`)
  }

export const getMaterialService =
  ({ api, errorHandler }) =>
  async (materialId) => {
    try {
      const { data } = await api.get(`/material/${materialId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createMaterialService =
  ({ api, errorHandler }) =>
  async (name) => {
    try {
      const { data } = await api.post("/material", { name })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateMaterialService =
  ({ api, errorHandler }) =>
  async (materialId, name) => {
    try {
      const { data } = await api.patch(`/material/${materialId}`, {
        name,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteMaterialService =
  ({ api, errorHandler }) =>
  async (materialId) => {
    try {
      const { data } = await api.delete(`/material/${materialId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
