export const up = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.boolean("deleted").defaultTo(0)
    table.boolean("confirmed").defaultTo(0)
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("deleted")
    table.dropColumn("confirmed")
  })
}
