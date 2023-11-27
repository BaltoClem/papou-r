export const up = async (knex) => {
  await knex.schema.alterTable("cart__products", (table) => {
    table.integer("amount")
  })

  await knex.schema.alterTable("orders", (table) => {
    table.integer("amount").notNullable().defaultTo(1)
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("cart__products", (table) => {
    table.dropColumn("amount")
  })

  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("amount")
  })
}
