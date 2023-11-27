export const updateMaterialsOfProductService =
  ({ api, errorHandler }) =>
  async (productId, materialIds) => {
    try {
      const { data } = await api.patch(`/product/${productId}/materials`, {
        materialIds,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getMaterialsOfProductService =
  ({ api, errorHandler }) =>
  async (productId) => {
    try {
      const { data } = await api.get(`/product/${productId}/materials`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteMaterialsOfProductService =
  ({ api, errorHandler }) =>
  async (productId, materialIds) => {
    try {
      const { data } = await api.delete(
        `/product/${productId}/materials`,
        materialIds
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
