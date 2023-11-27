import BaseModel from "./BaseModel.js"
import ProductModel from "./ProductModel.js"

class MaterialModel extends BaseModel {
  static tableName = "materials"

  static relationMappings() {
    return {
      product_materials: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ProductModel,
        join: {
          from: "materials.id",
          through: {
            from: "product__materials.material_id",
            to: "product__materials.product_id",
          },
          to: "products.id",
        },
      },
    }
  }
}

export default MaterialModel
