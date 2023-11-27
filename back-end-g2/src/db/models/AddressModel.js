import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class AddressModel extends BaseModel {
  static tableName = "addresses"

  static relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "addresses.user_id",
          to: "users.id",
        },
      },
    }
  }
}

export default AddressModel
