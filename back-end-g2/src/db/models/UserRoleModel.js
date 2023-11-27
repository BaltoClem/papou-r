import BaseModel from "./BaseModel.js"

class UserRoleModel extends BaseModel {
  static tableName = "user__roles"

  static get idColumn() {
    return ["role_id", "user_id"]
  }
}

export default UserRoleModel
