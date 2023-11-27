export const getCategoriesService =
  ({ api }) =>
  async (limit, page) => {
    const { data } = await api.get(`/category?limit=${limit}&page=${page}`)

    return data
  }

export const getCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId) => {
    try {
      const { data } = await api.get(`/category/${categoryId}/`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createCategoryService =
  ({ api, errorHandler }) =>
  async (name, slug, description, imageUrl) => {
    try {
      const { data } = await api.post("/category", {
        name,
        slug,
        description,
        image_url: imageUrl,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId, name, slug, description, imageUrl) => {
    try {
      const { data } = await api.patch(`/category/${categoryId}`, {
        name,
        slug,
        description,
        image_url: imageUrl,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteCategoryService =
  ({ api, errorHandler }) =>
  async (categoryId) => {
    try {
      const { data } = await api.delete(`/category/${categoryId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
