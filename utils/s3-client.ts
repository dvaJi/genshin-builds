import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const bucketName = "genshinbuilds-archives";
const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  endpoint: process.env.BUCKET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY || "",
  },
});

async function list(game: string, locale?: string) {
  const data = await s3Client.send(
    new ListObjectsCommand({ Bucket: bucketName, Prefix: `${game}/` })
  );

  const filtered = (data.Contents ?? [])
    .map((item) => {
      if (!item.Key || item.Key === `${game}/`) {
        return null;
      }
      const [_game, slug, langWExt] = item.Key?.split("/") || [];
      return {
        game: _game,
        slug,
        lang: langWExt?.split(".")[0],
        key: item.Key,
      };
    })
    .filter((item) => item !== null && locale && item.lang === locale);

  return filtered.sort((a, b) => {
    if (!a || !b) {
      return 0;
    }
    return new Date(b.key).getTime() - new Date(a.key).getTime();
  });
}

async function get(key: string): Promise<string> {
  const data = await s3Client.send(
    new GetObjectCommand({ Bucket: bucketName, Key: key })
  );

  if (!data.Body) {
    throw new Error("No body");
  }

  return data.Body?.transformToString();
}

async function put(key: string, content: string) {
  const data = await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: content,
    })
  );

  return data;
}

const s3Utils = {
  list,
  get,
  put,
};

export default s3Utils;
