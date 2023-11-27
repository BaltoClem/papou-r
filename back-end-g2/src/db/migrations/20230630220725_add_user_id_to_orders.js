export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.integer("user_id").references("id").inTable("users").notNullable()
    table.integer("itemsQuantities").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("user_id")
    table.dropColumn("itemsQuantities")
  })
}
