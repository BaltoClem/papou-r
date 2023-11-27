import AddressModel from "../db/models/AddressModel.js"
import { adminAuth, auth } from "../middleware/auth.js"
import { adminOrSelfAuth, notFoundError } from "../../helpers/reponseHelpers.js"
import { getCurrentUser } from "../../helpers/getterHelpers.js"

const addressRoutes = ({ app }) => {
  app.get("/address", adminAuth, async (req, res) => {
    const { limit, page, orderField, address, filterField, filter } = req.query

    const query = AddressModel.query()

    if (orderField) {
      query.orderBy(orderField, address)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const record = await query.modify("paginate", limit, page)

    res.send({ result: record })
  })

  app.get("/address/:addressId", auth, async (req, res) => {
    const address = await AddressModel.query().findById(req.params.addressId)

    if (!address) {
      notFoundError(res)

      return
    }

    const currentUser = await getCurrentUser(req)

    if (!adminOrSelfAuth(res, currentUser, address.user_id)) {
      return
    }

    res.send({ result: address })
  })

  app.post("/address", auth, async (req, res) => {
    const {
      body: {
        fullname,
        street_name,
        zipcode,
        city,
        country,
        complement,
        user_id,
      },
    } = req

    const currentUser = await getCurrentUser(req)

    if (!adminOrSelfAuth(res, currentUser, user_id)) {
      return
    }

    const newAddress = await AddressModel.query()
      .insert({
        fullname: fullname,
        street_name: street_name,
        zipcode: zipcode,
        city: city,
        country: country,
        complement: complement,
        in_use: true,
        user_id: user_id,
      })
      .returning("*")

    res.status(201).send({ result: newAddress })
  })

  app.patch("/address/:addressId", auth, async (req, res) => {
    const {
      body: { fullname, street_name, zipcode, city, country, complement },
      params: { addressId: addressId },
    } = req

    const address = await AddressModel.query().findById(addressId)

    if (!address) {
      return
    }

    const currentUser = await getCurrentUser(req)

    if (!adminOrSelfAuth(res, currentUser, address.user_id)) {
      return
    }

    const updatedaddress = await AddressModel.query()
      .update({
        ...(fullname ? { fullname } : {}),
        ...(street_name ? { street_name } : {}),
        ...(zipcode ? { zipcode } : {}),
        ...(city ? { city } : {}),
        ...(country ? { country } : {}),
        ...(complement ? { complement } : {}),
      })
      .findOne({ id: addressId })
      .returning("*")

    res.send({ result: updatedaddress })
  })

  app.delete("/address/:addressId", auth, async (req, res) => {
    const query = AddressModel.query().findById(req.params.addressId)
    const address = await query

    if (!address) {
      notFoundError(res)

      return
    }

    const currentUser = await getCurrentUser(req)

    if (!adminOrSelfAuth(res, currentUser, address.user_id)) {
      return
    }

    await query.update({ ...address, in_use: false })
    res.send({ result: "OK" })
  })
}

export default addressRoutes
