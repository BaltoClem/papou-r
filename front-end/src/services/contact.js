export const getContactMessagesService =
  ({ api }) =>
  async () => {
    const { data } = await api.get("/contact")

    return data
  }

export const getContactMessageService =
  ({ api, errorHandler }) =>
  async (messageId) => {
    try {
      const { data } = await api.get(`/category/${messageId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const writeContactMessageService =
  ({ api, errorHandler }) =>
  async (email, title, text) => {
    try {
      const { data } = await api.post("/contact", { email, title, text })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteContactMessageService =
  ({ api, errorHandler }) =>
  async (messageId) => {
    try {
      const { data } = await api.delete(`/contact/${messageId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
