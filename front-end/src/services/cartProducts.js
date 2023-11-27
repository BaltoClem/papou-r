export const updateProductQuantityService =
  ({ api, errorHandler, cartId }) =>
  async (productId, quantity) => {
    try {
      const { data } = await api.patch(`/cart/${cartId}/products`, {
        productId: productId,
        quantity: quantity,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const addProductToCartService =
  ({ api, errorHandler, cartId }) =>
  async (productId, quantity) => {
    try {
      const { data } = await api.post(`/cart/${cartId}/products`, {
        productId: productId,
        quantity: quantity,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getProductsOfCartService =
  ({ api, errorHandler, cartId }) =>
  async () => {
    try {
      const { data } = await api.get(`/cart/${cartId}/products`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteProductOfCartService =
  ({ api, errorHandler, cartId }) =>
  async (productId) => {
    try {
      const { data } = await api.delete(
        `/cart/${cartId}/products/${productId}`,
        {
          productId,
        }
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
