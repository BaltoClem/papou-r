export const up = async (knex) => {
  await knex.schema.alterTable("images", (table) => {
    table.renameColumn("image_url", "url")
    table.unique("slug")
  })

  await knex.schema.alterTable("products", (table) => {
    table.boolean("deleted").defaultTo(0)
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("images", (table) => {
    table.renameColumn("url", "image_url")
    table.dropUnique("slug")
  })

  await knex.schema.alterTable("products", (table) => {
    table.dropColumn("deleted")
  })
}
