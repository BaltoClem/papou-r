export const seed = async (knex) => {
  return knex("user__roles")
    .del()
    .then(() => {
      return knex("roles")
        .del()
        .then(() => {
          return knex("roles").insert([
            { name: "user" },
            { name: "admin" },
            { name: "store_master" },
            { name: "super_user" },
            { name: "dummy" },
          ])
        })
    })
}
