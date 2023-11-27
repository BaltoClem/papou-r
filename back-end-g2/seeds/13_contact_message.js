export const seed = async (knex) => {
  return knex("contact_messages")
    .del()
    .then(() => {
      return knex("contact_messages").insert([
        {
          email: "gemteszieu@gmail.com",
          title: "Ses yeux",
          text: "Elle a les yeux revolvers . . . Elle a le regard qui tue . . ."
        },
       
      ])
    })
}
