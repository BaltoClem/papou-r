export const seed = async (knex) => {
  const [{ id: chairId1 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Chaise 1" })

  const [{ id: tableId1 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 1" })

  const [{ id: tableId2 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 2" })

  const [{ id: tableId3 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 3" })

  const [{ id: tableId4 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 4" })

  const [{ id: tableId5 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 5" })

  const [{ id: tableId6 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 6" })

  const [{ id: tableId7 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Table 7" })

  const [{ id: sofaId1 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Canapé 1" })

  const [{ id: wardrobeId1 }] = await knex
    .select("id")
    .from("products")
    .where({ name: "Commode 1" })

  const [{ id: categoryTableId }] = await knex
    .select("id")
    .from("categories")
    .where({ slug: "tables" })

  const [{ id: categoryChairId }] = await knex
    .select("id")
    .from("categories")
    .where({ slug: "chairs" })

  const [{ id: categorySofaId }] = await knex
    .select("id")
    .from("categories")
    .where({ slug: "sofas" })

  const [{ id: categoryWardrobeId }] = await knex
    .select("id")
    .from("categories")
    .where({ slug: "wardrobes" })

  return knex("product__categories")
    .del()
    .then(() => {
      return knex("product__categories").insert([
        {
          category_id: categoryTableId,
          product_id: tableId1,
        },
        {
          category_id: categoryTableId,
          product_id: tableId2,
        },
        {
          category_id: categoryTableId,
          product_id: tableId3,
        },
        {
          category_id: categoryTableId,
          product_id: tableId4,
        },
        {
          category_id: categoryTableId,
          product_id: tableId5,
        },
        {
          category_id: categoryTableId,
          product_id: tableId6,
        },
        {
          category_id: categoryTableId,
          product_id: tableId7,
        },
        {
          category_id: categoryChairId,
          product_id: chairId1,
        },
        {
          category_id: categorySofaId,
          product_id: sofaId1,
        },
        {
          category_id: categoryWardrobeId,
          product_id: wardrobeId1,
        },
      ])
    })
}
