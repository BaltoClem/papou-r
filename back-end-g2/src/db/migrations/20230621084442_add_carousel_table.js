export const up = async (knex) => {
  await knex.schema.createTable("carousel", (table) => {
    table.text("image_url").notNullable().unique()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("carousel")
}
