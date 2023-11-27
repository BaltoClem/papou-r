export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("display_name")
    table.text("email").notNullable().unique()
    table.text("password_hash").notNullable()
    table.text("password_salt").notNullable()
    table.text("phone_number")
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("user__roles", (table) => {
    table.increments("id")
    table.integer("role_id").references("id").inTable("roles").notNullable()
    table.integer("user_id").references("id").inTable("users").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("addresses", (table) => {
    table.increments("id")
    table.integer("user_id").references("id").inTable("users").notNullable()
    table.text("street_name").notNullable()
    table.integer("zipcode").notNullable()
    table.text("city").notNullable()
    table.text("country").notNullable()
    table.text("complement")
    table.boolean("in_use")
    table.integer("order").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("dimensions", (table) => {
    table.increments("id")
    table.integer("width").notNullable()
    table.integer("height").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("products", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.integer("price").notNullable()
    table.text("description").notNullable()
    table.integer("stock").notNullable()
    table
      .integer("dimension_id")
      .references("id")
      .inTable("dimensions")
      .notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("materials", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("product__materials", (table) => {
    table.increments("id")
    table
      .integer("material_id")
      .references("id")
      .inTable("materials")
      .notNullable()
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("categories", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("description").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("product__categories", (table) => {
    table.increments("id")
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .notNullable()
    table
      .integer("category_id")
      .references("id")
      .inTable("categories")
      .notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("comments", (table) => {
    table.increments("id")
    table.integer("user_id").references("id").inTable("users").notNullable()
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .notNullable()
    table.text("content").notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("carts", (table) => {
    table.increments("id")
    table.integer("user_id").references("id").inTable("users").notNullable()
    table.boolean("is_active")
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("cart__products", (table) => {
    table.increments("id")
    table.integer("cart_id").references("id").inTable("carts").notNullable()
    table
      .integer("product_id")
      .references("id")
      .inTable("products")
      .notNullable()
    table.timestamps(true, true, true)
  })

  await knex.schema.createTable("orders", (table) => {
    table.increments("id")
    table
      .integer("address_id")
      .references("id")
      .inTable("addresses")
      .notNullable()
    table.integer("cart_id").references("id").inTable("carts").notNullable()
    table.text("order_status").notNullable()
    table.timestamps(true, true, true)
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("orders")
  await knex.schema.dropTable("cart__products")
  await knex.schema.dropTable("carts")
  await knex.schema.dropTable("comments")
  await knex.schema.dropTable("product__categories")
  await knex.schema.dropTable("categories")
  await knex.schema.dropTable("product__materials")
  await knex.schema.dropTable("materials")
  await knex.schema.dropTable("products")
  await knex.schema.dropTable("dimensions")
  await knex.schema.dropTable("addresses")
  await knex.schema.dropTable("user__roles")
  await knex.schema.dropTable("roles")
  await knex.schema.dropTable("users")
}
