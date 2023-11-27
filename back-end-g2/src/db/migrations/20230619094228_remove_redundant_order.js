export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.renameColumn("order_status", "status")
  })

  await knex.schema.alterTable("addresses", (table) => {
    table.dropColumn("order")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.renameColumn("status", "order_status")
  })

  await knex.schema.alterTable("addresses", (table) => {
    table.integer("order").notNullable()
  })
}
