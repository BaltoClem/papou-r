export const updateImagesOfProductService =
  ({ api, errorHandler }) =>
  async (productId, imagesIds) => {
    try {
      const { data } = await api.patch(`/product/${productId}/images`, {
        imageIds: imagesIds,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getImagesOfProductService =
  ({ api, errorHandler }) =>
  async (productId) => {
    try {
      const { data } = await api.get(`/product/${productId}/images`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteImagesOfProductService =
  ({ api, errorHandler }) =>
  async (productId, imageId) => {
    try {
      const { data } = await api.delete(
        `/product/${productId}/images/${imageId}`
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
