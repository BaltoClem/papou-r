export const updateProductsOfCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId, productIds) => {
    try {
      const { data } = await api.patch(`/category/${categoryId}/products`, {
        productsId: [productIds],
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getProductsOfCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId) => {
    try {
      const { data } = await api.get(`/category/${categoryId}/products`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteProductsOfCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId, productIds) => {
    try {
      const { data } = await api.delete(
        `/category/${categoryId}/products`,
        productIds
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
