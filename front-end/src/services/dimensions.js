export const getDimensionsService =
  ({ api }) =>
  async (limit, page) => {
    return await api.get(`/dimension?limit=${limit}&page=${page}`)
  }

export const getDimensionsByIdService =
  ({ api, errorHandler }) =>
  async (dimensionsId) => {
    try {
      const { data } = await api.get(`/dimension/${dimensionsId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createDimensionsService =
  ({ api, errorHandler }) =>
  async (width, height, length) => {
    try {
      const { data } = await api.post("/dimension", { width, height, length })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateDimensionsService =
  ({ api, errorHandler }) =>
  async (dimensionsId, width, height, length) => {
    try {
      const { data } = await api.patch(`/dimension/${dimensionsId}`, {
        height,
        width,
        length,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteDimensionsService =
  ({ api, errorHandler }) =>
  async (dimensionsId) => {
    try {
      const { data } = await api.delete(`/dimension/${dimensionsId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
