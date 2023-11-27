export const seed = async (knex) => {
  return knex("dimensions")
    .del()
    .then(() => {
      return knex("dimensions").insert([
        {
          height: 150,
          width: 100,
          length: 400,
        },
        {
          height: 100,
          width: 100,
          length: 400,
        },
        {
          height: 125,
          width: 125,
          length: 400,
        },
      ])
    })
}
