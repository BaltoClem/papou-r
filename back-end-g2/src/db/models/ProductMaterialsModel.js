import BaseModel from "./BaseModel.js"

class ProductMaterialsModel extends BaseModel {
  static tableName = "product__materials"

  static get idColumn() {
    return ["product_id", "material_id"]
  }
}

export default ProductMaterialsModel
