export const seed = async (knex) => {
  return knex("materials")
    .del()
    .then(() => {
      return knex("materials").insert([
        {
          name: "Chêne",
        },
        {
          name: "Cuir",
        },
        {
          name: "Fer forgé",
        },
        {
          name: "Inox",
        },
        {
          name: "Tissus",
        },
      ])
    })
}
