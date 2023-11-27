export const up = async (knex) => {
  await knex.schema.alterTable("product__images", (table) => {
    table.unique(["product_id", "image_id"])
    table.dropColumn("id")
  })
}

export const down = async (knex) => {
  await knex.schema.alterTable("product__images", (table) => {
    table.dropUnique(["product_id", "image_id"])
    table.increments("id")
  })
}
