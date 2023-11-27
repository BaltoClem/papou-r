import BaseModel from "./BaseModel.js"
import UserModel from "./UserModel.js"

class RoleModel extends BaseModel {
  static tableName = "roles"

  static relationMappings() {
    return {
      userRoles: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: "users.id",
          through: {
            from: "user__roles.user_id",
            to: "user__roles.role_id",
          },
          to: "roles.id",
        },
      },
    }
  }
}

export default RoleModel
