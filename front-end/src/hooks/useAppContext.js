import parseSession from "@/utils/parseSession"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useCookies } from "react-cookie"
import * as categoriesService from "@/services/categories"
import * as dimensionsService from "@/services/dimensions"
import * as productsService from "@/services/products"
import { signInService } from "@/services/signIn"
import { signUpService } from "@/services/signUp"
import * as usersService from "@/services/users"
import * as categoryProductsService from "@/services/categoryProducts"
import errorHandler from "@/utils/errorHandler"
import * as userRolesService from "@/services/userRoles"
import * as materialsService from "@/services/materials"
import * as rolesService from "@/services/roles"
import * as imagesService from "@/services/images"
import * as productImagesService from "@/services/productImages"
import * as productMaterialsService from "@/services/productMaterials"
import * as carouselService from "@/services/carousel"
import * as isAdminService from "@/services/isAdmin"
import * as cartService from "@/services/cart"
import * as cartProductsService from "@/services/cartProducts"
import * as addressService from "@/services/addresses"
import * as orderService from "@/services/orders"
import * as contactService from "@/services/contact"
import * as ProductCategoriesService from "@/services/productCategories"
import { createApi } from "@/services/api"
import { v4 as uuidv4 } from "uuid"
import { useRouter } from "next/router"

export const AppContextProvider = (props) => {
  const { isPublicPage, ...otherProps } = props
  const [session, setSession] = useState(null)
  const [cartId, setCartId] = useState(null)
  const [uuid, setUuid] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies([
    "session",
    "uuid",
    "cartId",
  ])
  const api = createApi({ jwt: cookies.session, uuid: cookies.uuid })
  const args = { api, errorHandler }
  const router = useRouter()

  const createCart = cartService.createCartService(args)
  const getAllCarts = cartService.getAllCartsService({ api })
  const getCartOfUser = cartService.getCartOfUserService({
    api,
    errorHandler,
    setCartId,
  })
  const getCart = cartService.getCartService(args)
  const deleteCart = cartService.deleteCartService({
    api,
    errorHandler,
    cartId,
  })
  const updateCart = cartService.updateCartService({
    api,
    errorHandler,
    cartId,
    setCookie,
  })

  const signIn = signInService({
    api,
    setCookie,
    errorHandler,
    updateCart,
    cartId,
    uuid,
    getCartOfUser,
  })
  const signUp = signUpService(args)

  const logOut = useCallback(() => {
    removeCookie("session", { path: "/" })
    removeCookie("uuid", { path: "/" })
    removeCookie("cartId", { path: "/" })
    setSession(null)
    setUuid(null)
    setCartId(null)
  }, [removeCookie])

  const resetCart = useCallback(() => {
    removeCookie("uuid", { path: "/" })
    removeCookie("cartId", { path: "/" })
    setUuid(null)
    setCartId(null)
  }, [removeCookie])

  const getCategories = categoriesService.getCategoriesService({ api })
  const getCategory = categoriesService.getCategoryService(args)
  const createCategory = categoriesService.createCategoryService(args)
  const updateCategory = categoriesService.updateCategoryService(args)
  const deleteCategory = categoriesService.deleteCategoryService(args)

  const getDimensions = dimensionsService.getDimensionsService({ api })
  const getDimensionsById = dimensionsService.getDimensionsByIdService(args)
  const createDimensions = dimensionsService.createDimensionsService(args)
  const updateDimensions = dimensionsService.updateDimensionsService(args)
  const deleteDimensions = dimensionsService.deleteDimensionsService(args)

  const getImages = imagesService.getImagesService({ api })
  const getImage = imagesService.getImageService(args)
  const uploadImage = imagesService.uploadImageService(args)
  const deleteImage = imagesService.deleteImageService(args)
  const updateImage = imagesService.updateImageService(args)

  const getMaterials = materialsService.getMaterialsService({ api })
  const getMaterial = materialsService.getMaterialService(args)
  const createMaterial = materialsService.createMaterialService(args)
  const updateMaterial = materialsService.updateMaterialService(args)
  const deleteMaterial = materialsService.deleteMaterialService(args)

  const getProductsOfCategory =
    categoryProductsService.getProductsOfCategoryService(args)
  const updateProductsOfCategory =
    categoryProductsService.updateProductsOfCategoryService(args)
  const deleteProductsOfCategory =
    categoryProductsService.deleteProductsOfCategoryService(args)

  const getImagesOfProduct =
    productImagesService.getImagesOfProductService(args)
  const updateImagesOfProduct =
    productImagesService.updateImagesOfProductService(args)
  const deleteImagesOfProduct =
    productImagesService.deleteImagesOfProductService(args)

  const getMaterialOfProduct =
    productMaterialsService.getMaterialsOfProductService(args)
  const updateMaterialsOfProduct =
    productMaterialsService.updateMaterialsOfProductService(args)
  const deleteMaterialsOfProduct =
    productMaterialsService.deleteMaterialsOfProductService(args)

  const getProducts = productsService.getProductsService({ api })
  const getProduct = productsService.getProductService(args)
  const createProduct = productsService.createProductService(args)
  const deleteProduct = productsService.deleteProductService(args)
  const updateProduct = productsService.updateProductService(args)

  const getRoles = rolesService.getRolesService({ api })
  const getRole = rolesService.getRoleService(args)
  const createRole = rolesService.createRoleService(args)
  const updateRole = rolesService.updateRoleService(args)
  const deleteRole = rolesService.deleteRoleService(args)

  const getUserRoles = userRolesService.getUserRolesService({ api })
  const addRoleToUser = userRolesService.addRoleToUserService(args)
  const deleteRoleToUser = userRolesService.deleteRoleToUserService(args)

  const getUsers = usersService.getUsersService(args)
  const getUser = usersService.getUserService(args)
  const updateUser = usersService.updateUserService(args)
  const deleteUser = usersService.deleteUserService(args)
  const sendForgottenPassword = usersService.forgottenPasswordUserService(args)
  const updatePassword = usersService.updatePasswordUserService

  const getCarousel = carouselService.getCarouselService({ api })
  const addImageToCarousel = carouselService.addImageToCarouselService(args)
  const deleteImageToCarousel =
    carouselService.deleteImageToCarouselService(args)

  const isAdmin = isAdminService.isAdminService({ api, session, router })
  const checkIsAdmin = isAdminService.checkIsAdminService({
    api,
    session,
    router,
  })

  const getProductsOfCart = cartProductsService.getProductsOfCartService({
    api,
    errorHandler,
    cartId,
  })
  const addProductToCart = cartProductsService.addProductToCartService({
    api,
    errorHandler,
    cartId,
  })
  const updateProductQuantity =
    cartProductsService.updateProductQuantityService({
      api,
      errorHandler,
      cartId,
    })
  const deleteProductOfCart = cartProductsService.deleteProductOfCartService({
    api,
    errorHandler,
    cartId,
  })

  const getAddresses = addressService.getAddressesService({ api })
  const getAddress = addressService.getAddressService(args)
  const createAddress = addressService.createAddressService(args)
  const updateAddress = addressService.updateAddressService(args)
  const deleteAddress = addressService.deleteAddressService(args)

  const getOrders = orderService.getOrdersService({ api })
  const getOrder = orderService.getOrderService(args)
  const createOrder = orderService.createOrderService({
    api,
    errorHandler,
    cartId,
  })
  const updateOrder = orderService.updateOrderService(args)
  const deleteOrder = orderService.deleteOrderService(args)

  const getProductCategories =
    ProductCategoriesService.getCategoriesOfProductService(args)
  const updateProductCategory =
    ProductCategoriesService.updateCategoriesOfProductService(args)

  const getContactMessages = contactService.getContactMessagesService({ api })
  const getContactMessage = contactService.getContactMessageService(args)
  const writeContactMessage = contactService.writeContactMessageService(args)
  const deleteContactMessage = contactService.deleteContactMessageService(args)

  const firstGuestInformations = useCallback(async () => {
    if (!cookies.uuid) {
      const newUuid = uuidv4()
      setUuid(newUuid)

      setCookie("uuid", newUuid, { path: "/" })

      if (!cookies.cartId) {
        const newApi = createApi({ jwt: null, uuid: newUuid })

        const createCartGuest = cartService.createCartService({
          api: newApi,
          errorHandler: errorHandler,
        })
        const [error, data] = await createCartGuest()

        if (error) {
          return
        }

        setCookie("cartId", data.result.id, { path: "/" })
      }
    }
  }, [cookies, setCookie])

  useEffect(() => {
    firstGuestInformations()

    const uuidCookies = cookies.uuid
    const jwt = cookies.session
    const cartIdCookies = cookies.cartId

    setUuid(uuidCookies)
    setCartId(cartIdCookies)

    if (!jwt) {
      return
    }

    setSession(parseSession(jwt))
  }, [cookies, firstGuestInformations])

  if (!isPublicPage && session === null) {
    return (
      <div className="fixed inset-0 bg-white z-1000 flex items-center justify-center h-screen w-screen">
        <p>Loading</p>
      </div>
    )
  }

  return (
    <AppContext.Provider
      {...otherProps}
      value={{
        state: {
          session,
          cookies,
          cartId,
        },
        guestInformations: {
          firstGuestInformations,
        },
        actions: {
          signIn,
          signUp,
          logOut,
          resetCart,
          getCategories,
          getCategory,
          createCategory,
          updateCategory,
          deleteCategory,
          getDimensions,
          getDimensionsById,
          createDimensions,
          updateDimensions,
          deleteDimensions,
          getImages,
          getImage,
          uploadImage,
          deleteImage,
          updateImage,
          getMaterials,
          getMaterial,
          createMaterial,
          updateMaterial,
          deleteMaterial,
          getProducts,
          getProduct,
          createProduct,
          deleteProduct,
          updateProduct,
          getProductsOfCategory,
          updateProductsOfCategory,
          deleteProductsOfCategory,
          getImagesOfProduct,
          updateImagesOfProduct,
          deleteImagesOfProduct,
          getMaterialOfProduct,
          updateMaterialsOfProduct,
          deleteMaterialsOfProduct,
          getRoles,
          getRole,
          createRole,
          updateRole,
          deleteRole,
          getUsers,
          getUser,
          updateUser,
          deleteUser,
          sendForgottenPassword,
          updatePassword,
          getUserRoles,
          addRoleToUser,
          deleteRoleToUser,
          getCarousel,
          addImageToCarousel,
          deleteImageToCarousel,
          isAdmin,
          checkIsAdmin,
          getAllCarts,
          getCartOfUser,
          getCart,
          createCart,
          deleteCart,
          getProductsOfCart,
          addProductToCart,
          updateProductQuantity,
          deleteProductOfCart,
          getAddresses,
          getAddress,
          createAddress,
          updateAddress,
          deleteAddress,
          getOrders,
          getOrder,
          createOrder,
          updateOrder,
          deleteOrder,
          getProductCategories,
          updateProductCategory,
          getContactMessages,
          getContactMessage,
          writeContactMessage,
          deleteContactMessage,
        },
      }}
    />
  )
}

const AppContext = createContext()
const useAppContext = () => useContext(AppContext)

export default useAppContext
