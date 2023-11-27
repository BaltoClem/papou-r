export const up = async (knex) => {
  await knex.schema.createTable("contact_messages", (table) => {
    table.increments("id")
    table.text("email").notNullable()
    table.text("title").notNullable()
    table.text("text").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("contact_messages")
}
