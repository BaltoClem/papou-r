export const up = async (knex) => {
  await knex.schema.alterTable("cart__products", (table) => {
    table.renameColumn("amount", "quantity")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("cart__products", (table) => {
    table.renameColumn("quantity", "amount")
  })
}
