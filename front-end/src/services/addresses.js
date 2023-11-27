export const getAddressesService =
  ({ api }) =>
  async () => {
    return await api.get("/address")
  }

export const getAddressService =
  ({ api, errorHandler }) =>
  async (addressId) => {
    try {
      const { data } = await api.get(`/address/${addressId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const createAddressService =
  ({ api, errorHandler }) =>
  async (fullname, street_name, zipcode, city, country, complement, userId) => {
    try {
      const { data } = await api.post("/address", {
        fullname,
        street_name,
        zipcode,
        city,
        country,
        complement,
        user_id: userId,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const updateAddressService =
  ({ api, errorHandler }) =>
  async (
    addressId,
    fullname,
    street_name,
    zipcode,
    city,
    country,
    complement
  ) => {
    try {
      const { data } = await api.patch(`/address/${addressId}`, {
        fullname,
        street_name,
        zipcode,
        city,
        country,
        complement,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }

export const deleteAddressService =
  ({ api, errorHandler }) =>
  async (addressId) => {
    try {
      const { data } = await api.delete(`/address/${addressId}`)

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
