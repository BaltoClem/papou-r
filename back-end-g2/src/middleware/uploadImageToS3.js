import { PutObjectCommand } from "@aws-sdk/client-s3"
import { readFileSync } from "node:fs"
import slugify from "@sindresorhus/slugify"
import s3Client from "../../libs/awsClient.js"

const uploadImage = async ({ imgBin }) => {
  const allowedFilesTypes = ["png", "jpeg", "jpg", "gif"]

  const [name, fileExtension] = imgBin.originalname.split(".")

  if (!allowedFilesTypes.includes(fileExtension)) {
    return [Error("Invalid file"), null]
  }

  const file = readFileSync(imgBin.path)
  const contents = Buffer.from(file)

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: "public/" + slugify(name) + "." + fileExtension,
    Body: contents,
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    const address = `https://${params.Bucket}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`

    return [null, address]
  } catch (err) {
    return [Error(err), null]
  }
}

export default uploadImage
