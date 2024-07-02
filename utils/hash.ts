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

const specialChars = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ñ: "n",
  ü: "u",
  Á: "A",
  É: "E",
  Í: "I",
  Ó: "O",
  Ú: "U",
};

export function slugify2(_value?: string, separator = "-") {
  if (!_value) return "";

  let value = _value.slice();

  for (const key in specialChars) {
    value = value.replace(
      new RegExp(key, "g"),
      specialChars[key as keyof typeof specialChars]
    );
  }

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
