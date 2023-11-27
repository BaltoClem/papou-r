import BaseModel from "./BaseModel.js"
import ProductModel from "./ProductModel.js"

class ImageModel extends BaseModel {
  static tableName = "images"

  static relationMappings() {
    return {
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ProductModel,
        join: {
          from: "images.id",
          through: {
            from: "product__images.image_id",
            to: "product__images.product_id",
          },
          to: "products.id",
        },
      },
    }
  }
}

export default ImageModel
