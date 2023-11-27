import { GetObjectCommand } from "@aws-sdk/client-s3"
import request from "supertest"
import app from "../app"
import {
  expectInsufficientPermission,
  expectInvalidAuth,
  loginAsAdmin,
  loginAsUser,
} from "../helpers/testHelpers"
import s3Client from "../libs/awsClient"
import ImageModel from "../src/db/models/ImageModel"

const getImage = (
  url = "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair1.png"
) =>
  ImageModel.query().findOne({
    url: url,
  })

const adminToken = (await loginAsAdmin()).body.result
const userToken = (await loginAsUser()).body.result

const fileName = "chaise.jpg"
const filePath = `tests/testFiles/${fileName}`

const fileName2 = "chaise2.jpg"
const filePath2 = `tests/testFiles/${fileName2}`

describe("Images - GET", () => {
  it("Should be able to get images", async () => {
    const res = await request(app).get(`/image?limit=14&page=1`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.images).toHaveLength(14)
  })

  it("Should be able to get an image by id", async () => {
    const image = await getImage()

    const res = await request(app).get(`/image/${image.id}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.result.id).toBe(image.id)
    expect(res.body.result.slug).toBe("chair1")
    expect(res.body.result.url).toBe(
      "https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/chair1.png"
    )
  })
})

describe("Images - POST", () => {
  it("Should be able to add images on table and on bucket", async () => {
    const res = await request(app)
      .post(`/image`)
      .attach("files", filePath)
      .set("Authorization", `bearer ${adminToken}`)

    const image = res.body.result[0]
    expect(res.statusCode).toBe(201)
    expect(image.slug).toBe("chaise")
    expect(image.url).toBe(
      `https://airneis-bucket.s3.eu-west-3.amazonaws.com/public/${fileName}`
    )

    const pathOnBucket = `public/${fileName}`
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pathOnBucket,
    }

    const command = new GetObjectCommand(params)

    try {
      const data = await s3Client.send(command)
      expect(data.$metadata.httpStatusCode).toBe(200)
    } catch (err) {
      return Error(err)
    }

    const deleted = await request(app)
      .delete(`/image/${image.id}`)
      .set("Authorization", `bearer ${adminToken}`)
    expect(deleted.statusCode).toBe(200)
    expect(deleted.body.result).toBe("OK")
  })

  it("Should not be able to add images if not logged in", async () => {
    const res = await request(app).post(`/image`).attach("files", filePath)

    expectInvalidAuth(res)
  })

  it("Should not be able to add images if not logged in as admin", async () => {
    const res = await request(app)
      .post(`/image`)
      .attach("files", filePath)
      .set("Authorization", `bearer ${userToken}`)

    expectInsufficientPermission(res)
  })
})

describe("Images - DELETE", () => {
  it("Should be able to delete an image on bucket and on table", async () => {
    const newImage = await request(app)
      .post("/image")
      .attach("files", filePath2)
      .set("Authorization", `bearer ${adminToken}`)

    expect(newImage.statusCode).toBe(201)
    const initialImageLength = (await request(app).get("/image")).body.result
      .images.length

    const res = await request(app)
      .delete(`/image/${newImage.body.result[0].id}`)
      .set("Authorization", `bearer ${adminToken}`)

    expect(res.statusCode).toBe(200)

    const newImageLength = (await request(app).get("/image")).body.result.images
      .length
    expect(initialImageLength).toBeGreaterThan(newImageLength)

    const pathOnBucket = `public/${fileName2}`
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pathOnBucket,
    }

    const command = new GetObjectCommand(params)

    try {
      await s3Client.send(command)
    } catch (err) {
      expect(err.$metadata.httpStatusCode).toBe(404)
      expect(err.Code).toBe("NoSuchKey")
    }
  })
})
