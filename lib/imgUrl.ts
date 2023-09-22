import { google, ImageItem, photon, staticaly } from "@utils/cdn-providers";
import { IMGS_CDN } from "./constants";

type GameFolder = "gi" | "tof" | "hsr";

type ImgOptions = {
  height?: number;
  width?: number;
  index?: number;
  quality?: number;
  crop?: boolean;
};

export const getImg = (game: GameFolder, path: string, options?: ImgOptions) =>
  generateUrl(
    path,
    options?.height,
    options?.width,
    options?.quality,
    options?.index,
    options?.crop,
    "/" + game
  );

export function getTofUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, undefined, index, crop, "/tof");
}

export function getTofUrlLQ(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, 10, index, crop, "/tof");
}

export function getUrlLQ(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, 10, index, crop, "/gi");
}

export function getUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, undefined, index, crop, "/gi");
}

export function getHsrUrl(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, undefined, index, crop, "/hsr");
}

export function getHsrUrlLQ(
  path: string,
  height?: number,
  width?: number,
  index = 1,
  crop = false
) {
  return generateUrl(path, height, width, 10, index, crop, "/hsr");
}

function generateUrl(
  path: string,
  height?: number,
  width?: number,
  quality?: number,
  index = 1,
  crop = false,
  folder = "/gi"
) {
  const href = IMGS_CDN + folder + path;
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
