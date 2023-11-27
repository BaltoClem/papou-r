export const up = async (knex) => {
  await knex.schema.alterTable("user__roles", (table) => {
    table.unique(["role_id", "user_id"])
    table.dropColumn("id")
  })

  await knex.schema.alterTable("product__materials", (table) => {
    table.unique(["material_id", "product_id"])
    table.dropColumn("id")
  })

  await knex.schema.alterTable("product__categories", (table) => {
    table.unique(["product_id", "category_id"])
    table.dropColumn("id")
  })

  await knex.schema.alterTable("cart__products", (table) => {
    table.unique(["cart_id", "product_id"])
    table.dropColumn("id")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("user__roles", (table) => {
    table.dropUnique(["role_id", "user_id"])
    table.increments("id")
  })

  await knex.schema.alterTable("product__materials", (table) => {
    table.dropUnique(["material_id", "product_id"])
    table.increments("id")
  })

  await knex.schema.alterTable("product__categories", (table) => {
    table.dropUnique(["product_id", "category_id"])
    table.increments("id")
  })

  await knex.schema.alterTable("cart__products", (table) => {
    table.dropUnique(["cart_id", "product_id"])
    table.increments("id")
  })
}
