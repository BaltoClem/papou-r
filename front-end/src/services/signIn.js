import { createApi } from "./api"
import { updateCartService } from "./cart"

export const signInService =
  ({ api, setCookie, errorHandler, cartId, uuid, getCartOfUser }) =>
  async (email, password) => {
    try {
      const {
        data: { result: jwt },
      } = await api.post("/sign-in", { email, password })

      setCookie("session", jwt, { path: "/" })

      const [error, cartGuest] = await getCartOfUser()

      if (error) {
        return
      }

      const newApi = createApi({ jwt: jwt, uuid: uuid })
      const updateCart = updateCartService({
        api: newApi,
        errorHandler,
        cartId,
        setCookie,
      })
      await updateCart(cartGuest)

      return [null, true]
    } catch (err) {
      return errorHandler(err)
    }
  }
