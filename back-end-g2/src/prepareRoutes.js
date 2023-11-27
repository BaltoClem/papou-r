import signInRoute from "./routes/users/signInRoute.js"
import signUpRoute from "./routes/users/signUpRoute.js"
import userRoutes from "./routes/users/userRoutes.js"
import productRoutes from "./routes/products/productRoutes.js"
import roleRoutes from "./routes/roleRoutes.js"
import userRoleRoutes from "./routes/users/userRolesRoutes.js"
import materialsRoutes from "./routes/products/materialsRoutes.js"
import categoryRoutes from "./routes/categories/categoryRoutes.js"
import categoriesProductRoutes from "./routes/categories/categoriesProductRoutes.js"
import contactMessageRoute from "./routes/contactMessagesRoutes.js"
import cartRoutes from "./routes/cart/cartRoutes.js"
import cartProductRoutes from "./routes/cart/cartProductsRoutes.js"
import imagesRoutes from "./routes/imagesRoutes.js"
import productMaterialsRoutes from "./routes/products/productMaterialsRoutes.js"
import productImagesRoutes from "./routes/products/productImagesRoutes.js"
import carouselRoutes from "./routes/carouselRoutes.js"
import orderRoutes from "./routes/orders/orderRoutes.js"
import addressRoutes from "./routes/addressRoutes.js"
import dimensionsRoutes from "./routes/products/dimensionsRoutes.js"
import productCategoriesRoutes from "./routes/products/productCategoriesroutes.js"
import orderWebHooks from "./routes/orders/orderWebHooks.js"

const prepareRoutes = (ctx) => {
  signUpRoute(ctx)
  signInRoute(ctx)
  userRoutes(ctx)
  categoryRoutes(ctx)
  dimensionsRoutes(ctx)
  productRoutes(ctx)
  userRoleRoutes(ctx)
  roleRoutes(ctx)
  materialsRoutes(ctx)
  categoriesProductRoutes(ctx)
  contactMessageRoute(ctx)
  cartRoutes(ctx)
  cartProductRoutes(ctx)
  imagesRoutes(ctx)
  productMaterialsRoutes(ctx)
  productImagesRoutes(ctx)
  carouselRoutes(ctx)
  orderRoutes(ctx)
  addressRoutes(ctx)
  productCategoriesRoutes(ctx)
  orderWebHooks(ctx)
}

export default prepareRoutes
