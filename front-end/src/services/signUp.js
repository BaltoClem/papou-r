export const signUpService =
  ({ api, errorHandler }) =>
  async (email, password, display_name, phone_number) => {
    try {
      const { data } = await api.post("/user", {
        email,
        password,
        display_name,
        phone_number,
      })

      return [null, data]
    } catch (err) {
      return errorHandler(err)
    }
  }
