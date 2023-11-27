import BaseModel from "./BaseModel.js"
import ProductModel from "./ProductModel.js"

class CategoryModel extends BaseModel {
  static tableName = "categories"

  static relationMappings() {
    return {
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ProductModel,
        join: {
          from: "categories.id",
          through: {
            from: "product__categories.category_id",
            to: "product__categories.product_id",
          },
          to: "products.id",
        },
      },
    }
  }
}

export default CategoryModel
