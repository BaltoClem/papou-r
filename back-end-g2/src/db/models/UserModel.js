import hashPassword from "../methods/hashPassword.js"
import AddressModel from "./AddressModel.js"
import BaseModel from "./BaseModel.js"
import OrderModel from "./OrderModel.js"
import RoleModel from "./RoleModel.js"

class UserModel extends BaseModel {
  static tableName = "users"

  static get modifiers() {
    return {
      ...BaseModel.modifiers,
      defaultSelects(builder) {
        builder.select("id", "display_name", "email", "phone_number", "deleted")
      },
    }
  }

  static relationMappings() {
    return {
      orders: {
        relation: BaseModel.HasManyRelation,
        modelClass: OrderModel,
        join: {
          from: "users.id",
          to: "orders.user_id",
        },
      },
      roles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: RoleModel,
        join: {
          from: "users.id",
          through: {
            from: "user__roles.user_id",
            to: "user__roles.role_id",
          },
          to: "roles.id",
        },
      },
      current_addresses: {
        relation: BaseModel.HasManyRelation,
        modelClass: AddressModel,
        join: {
          from: "users.id",
          to: "addresses.user_id",
        },
      },
    }
  }

  checkPassword = async (password) => {
    const [passwordHash] = await hashPassword(password, this.password_salt)

    return passwordHash === this.password_hash
  }
}

export default UserModel
