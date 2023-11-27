import slugify from "@sindresorhus/slugify"
import { totalPages } from "../../helpers/getterHelpers.js"
import {
  alreadyExistsError,
  notFoundError,
  uploadError,
  conflictsError,
} from "../../helpers/reponseHelpers.js"
import ImageModel from "../db/models/ImageModel.js"
import { adminAuth } from "../middleware/auth.js"
import deleteImage from "../middleware/deleteImageToS3.js"
import uploadImage from "../middleware/uploadImageToS3.js"
import validate from "../middleware/validate.js"
import { idValidator } from "../validators.js"

const imagesRoutes = ({ app, upload }) => {
  app.get("/image", async (req, res) => {
    const { limit, page, orderField, order, filterField, filter } = req.query

    const query = ImageModel.query()

    if (orderField) {
      query.orderBy(orderField, order)
    }

    if (filterField) {
      query.where(`${filterField}`, "like", `%${filter}%`)
    }

    const images = await query
    const total = totalPages(images.length, limit)

    const record = await query.modify("paginate", limit, page)

    res.send({ result: { images: record, totalPages: total } })
  })

  app.get("/image/:imageId", async (req, res) => {
    const {
      params: { imageId },
    } = req

    const image = await ImageModel.query().findById(imageId)

    if (!image) {
      notFoundError(res)

      return
    }

    res.send({ result: image })
  })

  app.post("/image", adminAuth, upload.any(), async (req, res) => {
    let canSendResult = true
    const images = await Promise.all(
      req.files.map(async (file) => {
        if (canSendResult) {
          const fileSlug = slugify(file.originalname.split(".").shift())

          const getImage = await ImageModel.query().findOne({ slug: fileSlug })

          if (getImage) {
            alreadyExistsError(res)
            canSendResult = false

            return
          }

          const [error, imgPath] = await uploadImage({
            imgBin: file,
          })

          if (error) {
            uploadError(res)
            canSendResult = false

            return
          }

          const img = await ImageModel.query()
            .insertAndFetch({
              slug: fileSlug,
              url: imgPath,
            })
            .returning("*")

          return img
        }
      })
    )

    if (!canSendResult) {
      return
    }

    res.status(201).send({ result: images })
  })

  app.patch(
    "/image/:imageId",
    adminAuth,
    upload.any(),
    validate({ params: { imageId: idValidator.required() } }),
    async (req, res) => {
      const imageId = req.params.imageId
      const query = ImageModel.query().findById(imageId)
      const image = await query

      if (!image) {
        notFoundError(res)

        return
      }

      const imgBin = req.files[0]

      const [, fileExtension] = imgBin.originalname.split(".")
      imgBin.originalname = image.slug + "." + fileExtension

      const [error, imgPath] = await uploadImage({
        imgBin: imgBin,
      })

      if (error) {
        uploadError(res)

        return
      }

      const updatedImage = await query.update({ url: imgPath })

      res.send({ result: updatedImage })
    }
  )

  app.delete(
    "/image/:imageId",
    adminAuth,
    validate({ params: { imageId: idValidator.required() } }),
    async (req, res) => {
      const imageId = req.params.imageId
      const query = ImageModel.query().findById(imageId)
      const image = await query

      if (!image) {
        notFoundError(res)

        return
      }

      const relatedProducts = await ImageModel.relatedQuery("products").for(
        imageId
      )

      if (relatedProducts.length > 0) {
        conflictsError(res)

        return
      }

      const fileName = image.url.split("/").pop()
      const deleted = await deleteImage({ pathOnBucket: `public/${fileName}` })

      await query.delete()

      res.send({ result: deleted })
    }
  )
}

export default imagesRoutes
