export const seed = async (knex) => {
  const [{ id: dimensionId }] = await knex
    .select("id")
    .from("dimensions")
    .where({ width: 100, height: 150 })

  return knex("products")
    .del()
    .then(() => {
      return knex("products").insert([
        {
          name: "Chaise 1",
          price: 60,
          description:
            "Installez-vous confortablement sur notre chaise 1. Elle est super-résistante et vous permettra de profiter d'un bon repas! Son rapport qualité prix est excellent et lui assure son succès.",
          stock: 1,
          dimension_id: dimensionId,
        },
        {
          name: "Table 1",
          price: 200,
          description: "Une belle table",
          stock: 10,
          dimension_id: dimensionId,
        },
        {
          name: "Table 2",
          price: 150,
          description: "Une table lambda",
          stock: 0,
          dimension_id: dimensionId,
        },
        {
          name: "Table 3",
          price: 175,
          description: "Une table ovale",
          stock: 4,
          dimension_id: dimensionId,
        },
        {
          name: "Table 4",
          price: 175,
          description: "Une table ovale",
          stock: 4,
          dimension_id: dimensionId,
        },
        {
          name: "Table 5",
          price: 175,
          description: "Une table ovale",
          stock: 4,
          dimension_id: dimensionId,
        },
        {
          name: "Table 6",
          price: 175,
          description: "Une table ovale",
          stock: 4,
          dimension_id: dimensionId,
        },
        {
          name: "Table 7",
          price: 175,
          description: "Une table ovale",
          stock: 4,
          dimension_id: dimensionId,
        },
        {
          name: "Canapé 1",
          price: 230,
          description: "Un sofa de qualité",
          stock: 9,
          dimension_id: dimensionId,
        },
        {
          name: "Commode 1",
          price: 170,
          description:
            "Une commode belle et utile pour ranger tout ce que vous souhaitez",
          stock: 3,
          dimension_id: dimensionId,
        },
      ])
    })
}
