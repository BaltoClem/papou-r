export const getOrdersService =
  ({ api }) =>
  async () => {
    return await api.get("/order")
  }

export const getOrderService =
  ({ api, errorHandler }) =>
  async (orderId) => {
    try {
      const { data } = await api.get(`/order/${orderId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createOrderService =
  ({ api, errorHandler, cartId }) =>
  async (addressId) => {
    try {
      const { data } = await api.post("/order", {
        address_id: addressId,
        cart_id: cartId,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateOrderService =
  ({ api, errorHandler }) =>
  async (orderId, addressId, status) => {
    try {
      const { data } = await api.patch(`/order/${orderId}`, {
        address_id: addressId,
        status: status,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteOrderService =
  ({ api, errorHandler }) =>
  async (orderId) => {
    try {
      const { data } = await api.delete(`/material/${orderId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
