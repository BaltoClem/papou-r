export const updateCategoriesOfProductService =
  ({ api, errorHandler }) =>
  async (productId, categoriesId) => {
    try {
      const { data } = await api.patch(`/product/${productId}/categories`, {
        categoriesId,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getCategoriesOfProductService =
  ({ api, errorHandler }) =>
  async (productId) => {
    try {
      const { data } = await api.get(`/product/${productId}/categories`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteCategoriesOfProductService =
  ({ api, errorHandler }) =>
  async (productId, categoriesID) => {
    try {
      const { data } = await api.delete(
        `/product/${productId}/categories${categoriesID}`
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
