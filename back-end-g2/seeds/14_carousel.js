export const seed = async (knex) => {
  const [{ url: imageChair1 }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "chair1" })

  const [{ url: imageTable3 }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "table3" })

  const [{ url: imageTable1 }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "table1" })

  return knex("carousel")
    .del()
    .then(() => {
      return knex("carousel").insert([
        { image_url: imageChair1 },
        { image_url: imageTable3 },
        { image_url: imageTable1 },
      ])
    })
}
