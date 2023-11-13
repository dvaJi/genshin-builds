export function hashToNum(host: string, index: number, min = 0, max = 1) {
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

export function slugify2(value?: string, separator = "-") {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\s/g, separator)
    .replace(/_/g, separator)
    .replace(/[^a-z0-9-]/g, "")
    .replace(/--+/g, separator);
}


export function slugify(value?: string, separator = "_") {
  if (!value) return "";

  return value
    .toLowerCase()
    .replace(/\s/g, separator)
    .replace(/\W/g, "")
    .replace(/__+/g, separator);
}
