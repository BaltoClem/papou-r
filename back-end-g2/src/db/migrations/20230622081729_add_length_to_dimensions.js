export const up = async (knex) => {
  await knex.schema.alterTable("dimensions", (table) => {
    table.string("length").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("dimensions", (table) => {
    table.dropColumn("length")
  })
}
