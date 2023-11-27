export const getCarouselService =
  ({ api }) =>
  async () => {
    const { data } = await api.get("/carousel")

    return data
  }

export const addImageToCarouselService =
  ({ api, errorHandler }) =>
  async (imageUrl) => {
    try {
      return await api.post("/carousel", { imageUrl })
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteImageToCarouselService =
  ({ api, errorHandler }) =>
  async (imageUrl) => {
    try {
      const { data } = await api.delete("/carousel", { imageUrl })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
