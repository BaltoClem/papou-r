import BaseModel from "./BaseModel.js"

class ProductImagesModel extends BaseModel {
  static tableName = "product__images"

  static get idColumn() {
    return ["product_id", "image_id"]
  }
}

export default ProductImagesModel
