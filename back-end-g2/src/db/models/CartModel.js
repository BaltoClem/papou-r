import BaseModel from "./BaseModel.js"
import CartProductModel from "./CartProductsModel.js"
import ProductModel from "./ProductModel.js"

class CartModel extends BaseModel {
  static tableName = "carts"

  static relationMappings() {
    return {
      all_products: {
        relation: BaseModel.HasManyRelation,
        modelClass: CartProductModel,
        join: {
          from: "carts.id",
          to: "cart__products.cart_id",
        },
      },
      products: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: ProductModel,
        join: {
          from: "carts.id",
          through: {
            from: "cart__products.cart_id",
            to: "cart__products.product_id",
          },
          to: "products.id",
        },
      },
    }
  }

  async getCartPrice() {
    await this.$fetchGraph("all_products.product")

    return this.all_products.reduce(
      (accumulator, cartProduct) =>
        cartProduct.quantity * cartProduct.product?.price + accumulator,
      0
    )
  }

  async getItemsQuantities() {
    await this.$fetchGraph("all_products")

    return this.all_products.reduce(
      (accumulator, cartProduct) => cartProduct.quantity + accumulator,
      0
    )
  }
}

export default CartModel
