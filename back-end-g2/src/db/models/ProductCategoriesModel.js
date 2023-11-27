import BaseModel from "./BaseModel.js"

class ProductCategoriesModel extends BaseModel {
  static tableName = "product__categories"

  static get idColumn() {
    return ["category_id", "product_id"]
  }
}

export default ProductCategoriesModel
