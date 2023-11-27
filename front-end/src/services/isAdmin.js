export const isAdminService =
  ({ api, session }) =>
  async () => {
    try {
      const { data } = await api.get(`/user/${session.user.id}/roles`)
      const roles = data.result.map((item) => item.name)

      return roles.includes("admin")
    } catch (err) {
      return false
    }
  }

export const checkIsAdminService =
  ({ api, session, router }) =>
  async () => {
    try {
      const { data } = await api.get(`/user/${session.user.id}/roles`)
      const roles = data.result.map((item) => item.name)

      if (!roles.includes("admin")) {
        router.push("/")
      }
    } catch (err) {
      router.push("/")
    }
  }
