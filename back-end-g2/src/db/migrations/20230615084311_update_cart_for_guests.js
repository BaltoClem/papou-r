export const up = async (knex) => {
  await knex.schema.alterTable("carts", (table) => {
    table.string("session_uuid").unique()
    table.integer("user_id").nullable().alter()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("carts", (table) => {
    table.dropColumn("session_uuid")
    table.dropForeign("user_id")
    table.integer("user_id").notNullable().alter()
  })
}
