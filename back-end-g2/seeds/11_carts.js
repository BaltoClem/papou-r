export const seed = async (knex) => {
  const [{ id: adminId }] = await knex
    .select("id")
    .from("users")
    .where({ display_name: "admin" })
  const [{ id: userId }] = await knex
    .select("id")
    .from("users")
    .where({ display_name: "user" })

  const fakeUUID = "6cce990d-3340-49c1-934a-9a1eff570883"
  const guestFakeUUID = "ad7fce4e-42ab-4d38-9ec8-7718601a3840"
  const userFakeUUID = "ad7fce4e-3340-4d38-9ec8-9a1eff570883"

  return knex("carts")
    .del()
    .then(() => {
      return knex("carts").insert([
        {
          user_id: adminId,
          session_uuid: fakeUUID,
          is_active: true,
        },
        {
          user_id: userId,
          session_uuid: userFakeUUID,
          is_active: true,
        },
        {
          session_uuid: guestFakeUUID,
          is_active: true,
        },
      ])
    })
}
