import { google, ImageItem, photon, staticaly } from "@/utils/cdn-providers";
import { IMGS_CDN, TOF_IMGS_CDN } from "./constants";

export function getTofUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, undefined, index, crop, TOF_IMGS_CDN);
}

export function getTofUrlLQ(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, 10, index, crop, TOF_IMGS_CDN);
}

export function getUrlLQ(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, 10, index, crop);
}

export function getUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, undefined, index, crop, IMGS_CDN);
}

function generateUrl(
  path: string,
  height?: number,
  width?: number,
  quality?: number,
  index = 1,
  crop = false,
  cdn = IMGS_CDN
) {
  const href = cdn + path;
  const item: ImageItem = {
    href,
    height,
    width,
    crop,
    quality,
  };

  return getImage(item, index);
}

function getImage(item: ImageItem, index = 0) {
  switch (import.meta.env.IMGS_CDN_PROVIDER) {
    case "photon":
      return photon(item, index);
    case "google":
      return google(item, index);
    case "staticaly":
      return staticaly(item);
    default:
      return item.href;
  }
}
