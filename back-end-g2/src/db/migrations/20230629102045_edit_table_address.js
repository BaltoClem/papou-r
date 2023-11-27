export const up = async (knex) => {
  await knex.schema.alterTable("addresses", (table) => {
    table.text("zipcode").alter()
    table.text("fullname").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("addresses", (table) => {
    table.integer("zipcode").alter()
    table.dropColumn("fullname")
  })
}
