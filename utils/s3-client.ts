import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const bucketName = "genshinbuilds-images";
const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY || "",
  },
});

export const getUploadUrl = async (params: PutObjectCommandInput) => {
  const command = new PutObjectCommand(params);
  return getSignedUrl(s3Client, command, { expiresIn: 60 });
};

export const deleteObject = async (key: string) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );
  } catch (err) {
    console.log("Error deleting object", err);
  }
};

export default s3Client;
