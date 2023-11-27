import BaseModel from "./BaseModel.js"
import CategoryModel from "./CategoryModel.js"
import DimensionModel from "./DimensionModel.js"
import ImageModel from "./ImageModel.js"
import MaterialModel from "./MaterialModel.js"
import UserModel from "./UserModel.js"

class ProductModel extends BaseModel {
  static tableName = "products"

  static relationMappings() {
    return {
      product_dimensions: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: DimensionModel,
        join: {
          from: "dimensions.id",
          to: "products.dimension_id",
        },
      },

      product_materials: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: MaterialModel,
        join: {
          from: "products.id",
          through: {
            from: "product__materials.product_id",
            to: "product__materials.material_id",
          },
          to: "materials.id",
        },
      },

      product_categories: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: CategoryModel,
        join: {
          from: "products.id",
          through: {
            from: "product__categories.product_id",
            to: "product__categories.category_id",
          },
          to: "categories.id",
        },
      },

      product_images: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ImageModel,
        join: {
          from: "products.id",
          through: {
            from: "product__images.product_id",
            to: "product__images.image_id",
          },
          to: "images.id",
        },
      },

      comments: {
        relation: BaseModel.HasOneThroughRelation,
        modelClass: UserModel,
        join: {
          from: "users.id",
          through: {
            from: "comments.user_id",
            to: "comments.product_id",
          },
          to: "products.id",
        },
      },
    }
  }
}

export default ProductModel
