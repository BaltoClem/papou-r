export const seed = async (knex) => {
  const [{ url: chairUrl }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "chair1" })

  const [{ url: tableUrl }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "table1" })

  const [{ url: sofaUrl }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "sofa1" })

  const [{ url: wardrobeUrl }] = await knex
    .select("url")
    .from("images")
    .where({ slug: "wardrobe1" })

  return knex("categories")
    .del()
    .then(() => {
      return knex("categories").insert([
        {
          name: "Nos tables",
          slug: "tables",
          image_url: tableUrl,
          description: "Tables en tout genre . . . ",
        },
        {
          name: "Nos chaises",
          slug: "chairs",
          image_url: chairUrl,
          description: "Les plus belles de chaises",
        },
        {
          name: "Nos canapés",
          slug: "sofas",
          image_url: sofaUrl,
          description: "Pour refaire votre salon !",
        },
        {
          name: "Nos commodes",
          slug: "wardrobes",
          image_url: wardrobeUrl,
          description: "Toujours plus de rangement !",
        },
      ])
    })
}
