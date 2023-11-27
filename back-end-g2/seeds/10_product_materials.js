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

  const [{ id: cheneId }] = await knex
    .select("id")
    .from("materials")
    .where({ name: "Chêne" })

  const [{ id: ferId }] = await knex
    .select("id")
    .from("materials")
    .where({ name: "Fer forgé" })

  const [{ id: cuirId }] = await knex
    .select("id")
    .from("materials")
    .where({ name: "Cuir" })

  const [{ id: inoxId }] = await knex
    .select("id")
    .from("materials")
    .where({ name: "Inox" })

  const [{ id: tissusId }] = await knex
    .select("id")
    .from("materials")
    .where({ name: "Tissus" })

  return knex("product__materials")
    .del()
    .then(() => {
      return knex("product__materials").insert([
        {
          product_id: chairId1,
          material_id: cuirId,
        },
        {
          product_id: chairId1,
          material_id: inoxId,
        },
        {
          product_id: tableId1,
          material_id: cheneId,
        },
        {
          product_id: tableId1,
          material_id: ferId,
        },
        {
          product_id: tableId2,
          material_id: cheneId,
        },
        {
          product_id: tableId2,
          material_id: inoxId,
        },
        {
          product_id: tableId3,
          material_id: cheneId,
        },
        {
          product_id: tableId3,
          material_id: ferId,
        },
        {
          product_id: tableId4,
          material_id: cheneId,
        },
        {
          product_id: tableId4,
          material_id: inoxId,
        },
        {
          product_id: tableId5,
          material_id: cheneId,
        },
        {
          product_id: tableId5,
          material_id: ferId,
        },
        {
          product_id: tableId6,
          material_id: cheneId,
        },
        {
          product_id: tableId6,
          material_id: ferId,
        },
        {
          product_id: tableId7,
          material_id: cheneId,
        },
        {
          product_id: tableId7,
          material_id: ferId,
        },
        {
          product_id: sofaId1,
          material_id: tissusId,
        },
        {
          product_id: sofaId1,
          material_id: inoxId,
        },
        {
          product_id: wardrobeId1,
          material_id: cheneId,
        },
        {
          product_id: wardrobeId1,
          material_id: ferId,
        },
      ])
    })
}
