import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import s3Client from "../../libs/awsClient.js"

const deleteImage = async ({ pathOnBucket }) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: pathOnBucket,
  }

  try {
    await s3Client.send(new DeleteObjectCommand(params))

    return "OK"
  } catch (err) {
    return Error(err)
  }
}

export default deleteImage
