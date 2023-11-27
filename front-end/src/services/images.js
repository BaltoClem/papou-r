export const getImagesService =
  ({ api }) =>
  async (limit, page) => {
    return await api.get(`/image?limit=${limit}&page=${page}`)
  }

export const getImageService =
  ({ api, errorHandler }) =>
  async (imageId) => {
    try {
      const { data } = await api.get(`/image/${imageId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const uploadImageService =
  ({ api, errorHandler }) =>
  async (files) => {
    let formData = new FormData()
    const headerConfig = {
      headers: { "content-type": "multipart/form-data" },
    }

    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i])
    }

    try {
      const { data } = await api.post("/image", formData, headerConfig)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateImageService =
  ({ api, errorHandler }) =>
  async (imageId, files) => {
    let formData = new FormData()
    const headerConfig = {
      headers: { "content-type": "multipart/form-data" },
    }

    formData.append("file", files[0])

    try {
      const { data } = await api.patch(
        `/image/${imageId}`,
        formData,
        headerConfig
      )

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteImageService =
  ({ api, errorHandler }) =>
  async (imageId) => {
    try {
      const { data } = await api.delete(`/image/${imageId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
