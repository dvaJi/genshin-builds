import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ads = await fetch(process.env.ADS_TXT_PUB || "");
  const adsText = await ads.text();
  return res.status(200).send(adsText);
}
