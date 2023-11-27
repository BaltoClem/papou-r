export const up = async (knex) => {
  await knex.schema.createTable("images", (table) => {
    table.increments("id")
    table.text("slug").notNullable()
    table.text("image_url").notNullable()
  })

  await knex.schema.createTable("product__images", (table) => {
    table.increments("id")
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .notNullable()
    table.integer("image_id").references("id").inTable("images").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("product__images")
  await knex.schema.dropTable("images")
}
