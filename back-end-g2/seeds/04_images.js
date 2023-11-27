export const seed = async (knex) => {
  return knex("images")
    .del()
    .then(() => {
      return knex("images").insert([
        {
          slug: "chair1",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair1.png",
        },
        {
          slug: "chair2",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair2.jpg",
        },
        {
          slug: "chair3",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair3.jpg",
        },
        {
          slug: "chair4",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair4.jpg",
        },
        {
          slug: "chair5",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair5.jpg",
        },
        {
          slug: "sofa1",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/sofa1.png",
        },
        {
          slug: "table1",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table1.png",
        },
        {
          slug: "table2",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table2.png",
        },
        {
          slug: "table3",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table3.png",
        },
        {
          slug: "table4",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table4.jpg",
        },
        {
          slug: "table5",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table5.jpg",
        },
        {
          slug: "table6",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table6.jpg",
        },
        {
          slug: "table7",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/table7.jpg",
        },
        {
          slug: "wardrobe1",
          url: "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/wardrobe1.png",
        },
      ])
    })
}
