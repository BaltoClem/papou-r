export const seed = async (knex) => {
  const [admin] = await knex
    .select("id")
    .from("users")
    .where({ email: "admin@airneis.com" })

  const [user] = await knex
    .select("id")
    .from("users")
    .where({ email: "user@airneis.com" })

  const allRoles = await knex.select("id", "name").from("roles")
  const userRole = allRoles.find(({ name }) => name === "user")

  const adminRoles = allRoles.map((role) => {
    return { role_id: role.id, user_id: admin.id }
  })

  return knex("user__roles")
    .del()
    .then(() => {
      return knex("user__roles").insert([
        ...adminRoles,
        {
          role_id: userRole.id,
          user_id: user.id,
        },
      ])
    })
}
