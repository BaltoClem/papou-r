import BaseModel from "./BaseModel.js"
import ProductModel from "./ProductModel.js"

class CartProductModel extends BaseModel {
  static tableName = "cart__products"

  static get idColumn() {
    return ["cart_id", "product_id"]
  }

  static relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: ProductModel,
        join: {
          from: "cart__products.product_id",
          to: "products.id",
        },
      },
    }
  }
}

export default CartProductModel
