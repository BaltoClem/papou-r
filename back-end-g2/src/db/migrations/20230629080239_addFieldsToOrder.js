export const up = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.string("session_id").notNullable()
    table.string("payment_intent")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("orders", (table) => {
    table.dropColumn("session_id")
    table.dropColumn("payment_intent")
  })
}
