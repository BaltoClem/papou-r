import AddressModel from "./AddressModel.js"
import BaseModel from "./BaseModel.js"
import CartModel from "./CartModel.js"

class OrderModel extends BaseModel {
  static tableName = "orders"

  static relationMappings() {
    return {
      cart: {
        relation: BaseModel.HasOneRelation,
        modelClass: CartModel,
        join: {
          from: "orders.cart_id",
          to: "orders.id",
        },
      },

      address: {
        relation: BaseModel.HasOneRelation,
        modelClass: AddressModel,
        join: {
          from: "orders.address_id",
          to: "addresses.id",
        },
      },
    }
  }
}

export default OrderModel
