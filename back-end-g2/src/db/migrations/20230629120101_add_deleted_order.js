export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.boolean("deleted").defaultTo(0)
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("deleted")
  })
}
