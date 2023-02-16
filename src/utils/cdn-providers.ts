import { parseUri } from "./parse-uri";

export type ImageItem = {
  href: string;
  quality?: number;
  crop?: boolean;
  height?: number;
  width?: number;
};

export function google(item: ImageItem, index: number) {
  const ele = parseUri(item.href);
  return `https://images${hashToNum(
    ele.host,
    index,
    0,
    2
  )}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&gadget=a&no_expand=1${
    item.width ? "&resize_w=" + item.width : ""
  }&rewriteMime=image/*&url=${encodeURIComponent(item.href)}`;
}

export function photon(item: ImageItem, index: number) {
  const ele = parseUri(item.href);
  const quality = item.quality || getQuality();
  const crop =
    item.crop && item.height
      ? `&crop=0px,0px,${item.width}px,${item.height}px`
      : "";
  return `https://i${hashToNum(ele.host, index, 0, 2)}.wp.com/${
    ele.authority + ele.path
  }?strip=all&quality=${quality}${item.width ? "&w=" + item.width : ""}${crop}`;
}

export function staticaly(item: ImageItem) {
  const ele = parseUri(item.href);
  return `https://cdn.statically.io/img/${ele.authority + ele.path}${
    item.width ? "?w=" + item.width : ""
  }`;
}

function getQuality() {
  switch (networkType()) {
    case 1: // Medium network
      return 60;
    case 2: // Slow network
      return 40;
    default:
      return 100;
  }
}

function networkType() {
  try {
    var connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;
    if (!connection || !connection.effectiveType) return 0;
    if (connection.effectiveType.indexOf("2g") >= 0) return 2;
    if (connection.effectiveType.indexOf("3g") >= 0) return 1;
    return 0;
  } catch (err) {
    return 0;
  }
}

function hashToNum(host: string, index: number, min = 0, max = 1) {
  var random = function random(seed: number, max: number, min: number) {
    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280;
    return min + rnd * (max - min);
  };

  var hash = index;

  for (var i = 0; i < host.length; i++) {
    hash = (hash << 5) - hash + host.charCodeAt(i);
    hash = hash & hash;
  }

  return Math.floor(random(hash, min, max));
}
