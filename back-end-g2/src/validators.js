import yup from "yup"

export const idValidator = yup.number().integer().positive().label("Id")

export const nameValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "E.INVALID.display_name")
  .label("Name")

export const emailValidator = yup
  .string()
  .email("E.INVALID.email")
  .label("E-mail")

export const passwordValidator = yup
  .string()
  .min(8)
  .matches(
    /^(?=.*[\p{Ll}])(?=.*[\p{Lu}])(?=.*[0-9])(?=.*[^0-9\p{Lu}\p{Ll}]).*$/gu,
    "E.INVALID.password"
  )
  .label("Password")

export const phoneNumberValidator = yup
  .string()
  .matches(/[+](?:[0-9]●?){6,14}[0-9]/, "E.INVALID.phone")

export const stringValidator = yup.string()

export const imageValidator = yup
  .string()
  .matches(/[/].+(.png|.jpg|.jpeg|.webp)$/, "E.INVALID.image_name")

export const slugValidator = yup
  .string()
  .matches(/^[a-z0-9]+[a-z0-9-]*$/, "E.INVALID.slug")

export const widthValidator = yup
  .number()
  .integer("E.INVALID.integer")
  .required("E.MISSING.width")
export const heightValidator = yup
  .number()
  .integer("E.INVALID.integer")
  .required("E.MISSING.height")
export const lengthValidator = yup
  .number()
  .integer("E.INVALID.integer")
  .required("E.MISSING.length")

export const pageValidator = yup.number().integer()

export const limitValidator = yup.number().integer().min(1).max(100).default(5)

export const arrayValidator = yup.array()

export const imageNameValidator = yup
  .string()
  .required("E.MISSING.image_name")
  .matches(/^[\p{L} -]+$/u, "E.INVALID.image_name")

export const productNameValidator = yup
  .string()
  .matches(/^[\p{L} -]+$/u, "E.INVALID.product_name")

export const positiveIntegerValidator = yup
  .number()
  .integer("E.INVALID.integer")
  .positive("E.INVALID.positive")

export const priceValidator = positiveIntegerValidator.label("Price")

export const stockValidator = positiveIntegerValidator.label("Stock")

export const materialNameValidator = yup
  .string()
  .required("E.MISSING.material_name")
  .label("Material name")
  .matches(/^[a-zA-Z -]+$/u, "E.INVALID.material_name")

export const maxPriceValidator = (minPriceRef) => {
  return yup
    .number()
    .when(minPriceRef, {
      is: (minPrice) => minPrice !== undefined,
      then: yup.number().min(yup.ref(minPriceRef)).nullable(),
      otherwise: yup.number().nullable(),
    })
    .label("Max Price")
}

export const booleanValidator = yup.boolean().nullable()

export const sortOrderValidator = yup
  .string()
  .oneOf(["asc", "desc"], "Invalid sortOrder value")
  .nullable()
  .label("SortOrder")

export const sortByValidator = yup
  .string()
  .oneOf(["price", "createdAt"], "Invalid sortBy value")
  .nullable()
  .label("SortBy")
