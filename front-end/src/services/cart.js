export const getAllCartsService =
  ({ api }) =>
  async () => {
    const { data } = await api.get("/carts")

    return data
  }

export const createCartService =
  ({ api, errorHandler }) =>
  async () => {
    try {
      const { data } = await api.post("/cart")

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getCartOfUserService =
  ({ api, errorHandler }) =>
  async () => {
    try {
      const { data } = await api.get("/cart")

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const getCartService =
  ({ api, errorHandler }) =>
  async (cartId) => {
    try {
      const { data } = await api.get(`/cart/${cartId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateCartService =
  ({ api, errorHandler, cartId, setCookie }) =>
  async (cartGuest) => {
    try {
      const getCartOfUser = getCartOfUserService({ api, errorHandler })
      const [error, dataCart] = await getCartOfUser()

      if (error) {
        return
      }

      if (
        cartGuest.result.cart_id !== dataCart.result.cart_id &&
        cartGuest.result.products.length === 0
      ) {
        setCookie("cartId", dataCart.result.cart_id)

        return
      }

      const { data } = await api.patch(`/cart/${cartId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteCartService =
  ({ api, errorHandler }) =>
  async (cartId) => {
    try {
      const { data } = await api.delete(`/cart/${cartId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
