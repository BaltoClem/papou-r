export const up = async (knex) => {
  await knex.schema.alterTable("categories", (table) => {
    table.text("slug").notNullable()
    table.text("image_url").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("categories", (table) => {
    table.dropColumn("slug")
    table.dropColumn("image_url")
  })
}
