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

  const [{ id: imageChair1 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "chair1" })

  const [{ id: imageChair2 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "chair2" })

  const [{ id: imageChair3 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "chair3" })

  const [{ id: imageChair4 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "chair4" })

  const [{ id: imageChair5 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "chair5" })

  const [{ id: imageTable1 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table1" })

  const [{ id: imageTable2 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table2" })

  const [{ id: imageTable3 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table3" })

  const [{ id: imageTable4 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table4" })

  const [{ id: imageTable5 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table5" })

  const [{ id: imageTable6 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table6" })

  const [{ id: imageTable7 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "table7" })

  const [{ id: imageSofa1 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "sofa1" })

  const [{ id: imageWardrobe1 }] = await knex
    .select("id")
    .from("images")
    .where({ slug: "wardrobe1" })

  return knex("product__images")
    .del()
    .then(() => {
      return knex("product__images").insert([
        {
          product_id: chairId1,
          image_id: imageChair1,
        },
        {
          product_id: chairId1,
          image_id: imageChair2,
        },
        {
          product_id: chairId1,
          image_id: imageChair3,
        },
        {
          product_id: chairId1,
          image_id: imageChair4,
        },
        {
          product_id: chairId1,
          image_id: imageChair5,
        },
        {
          product_id: tableId1,
          image_id: imageTable1,
        },
        {
          product_id: tableId2,
          image_id: imageTable2,
        },
        {
          product_id: tableId3,
          image_id: imageTable3,
        },
        {
          product_id: tableId4,
          image_id: imageTable4,
        },
        {
          product_id: tableId5,
          image_id: imageTable5,
        },
        {
          product_id: tableId6,
          image_id: imageTable6,
        },
        {
          product_id: tableId7,
          image_id: imageTable7,
        },
        {
          product_id: sofaId1,
          image_id: imageSofa1,
        },
        {
          product_id: wardrobeId1,
          image_id: imageWardrobe1,
        },
      ])
    })
}
