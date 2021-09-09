import { google, ImageItem, photon, staticaly } from "@utils/cdn-providers";
import { IMGS_CDN } from "./constants";

export function getUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  const href = IMGS_CDN + path;
  const item: ImageItem = {
    href,
    height,
    width,
    crop,
  };

  return getImage(item, index);
}

function getImage(item: ImageItem, index = 0) {
  switch (process.env.NEXT_PUBLIC_IMGS_CDN_PROVIDER) {
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
