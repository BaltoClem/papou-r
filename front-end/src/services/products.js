export const getProductsService =
  ({ api }) =>
  async (limit, page) => {
    return await api.get(`/product?limit=${limit}&page=${page}`)
  }

export const getProductService =
  ({ api, errorHandler }) =>
  async (productId) => {
    try {
      const { data } = await api.get(`/product/${productId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createProductService =
  ({ api, errorHandler }) =>
  async (description, productName, price, stock, dimensions) => {
    try {
      const { data } = await api.post("/product", {
        name: productName,
        price: price,
        description: description,
        stock: stock,
        dimension_id: dimensions,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateProductService =
  ({ api, errorHandler }) =>
  async (productId, description, productName, price, stock, dimensions) => {
    try {
      const { data } = await api.patch(`/product/${productId}`, {
        description,
        name: productName,
        price,
        stock,
        dimensions,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteProductService =
  ({ api, errorHandler }) =>
  async (productId) => {
    try {
      const { data } = await api.delete(`/product/${productId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
