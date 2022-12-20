const fs = require("fs");
const path = require("path");
const GenshinData = require("genshin-data").default;

const DATA_DIR = path.join(__dirname, "..", "_content", "genshin", "data");
const LANGUAGES = [
  "en",
  "es",
  "ja",
  "zh-tw",
  "de",
  "fr",
  "id",
  "it",
  "ko",
  "pt",
  "ru",
  "th",
  "tr",
  "vi",
];

const charactersIds = [
  "zhongli",
  "venti",
  "keqing",
  "klee",
  "chongyun",
  "barbara",
  "kamisato_ayaka",
  "collei",
];

const weaponsDict = {
  zhongli: "Polearm",
  venti: "Bow",
  keqing: "Sword",
  klee: "Catalyst",
  chongyun: "Claymore",
  barbara: "Catalyst",
  kamisato_ayaka: "Sword",
  collei: "Bow",
};
const elementDict = {
  zhongli: "Geo",
  venti: "Anemo",
  keqing: "Electro",
  klee: "Pyro",
  chongyun: "Cryo",
  barbara: "Hydro",
  kamisato_ayaka: "Cryo",
  collei: "Dendro",
};
const regionDict = {
  zhongli: "Liyue",
  venti: "Mondstadt",
  keqing: "Liyue",
  klee: "Mondstadt",
  chongyun: "Liyue",
  barbara: "Mondstadt",
  kamisato_ayaka: "Inazuma",
  collei: "Sumeru",
};

async function generateBuilds() {
  let object = {};

  for (const lang of LANGUAGES) {
    object[lang] = {};
    const gdata = new GenshinData({ language: localeToLang(lang) });
    const characters = (await gdata.characters()).filter((c) =>
      charactersIds.includes(c.id)
    );

    for (const character of characters) {
      object[lang][character.weapon_type] = weaponsDict[character.id];
      object[lang][weaponsDict[character.id]] = character.weapon_type;
      object[lang][character.element] = elementDict[character.id];
      object[lang][elementDict[character.id]] = character.element;
      object[lang][character.region] = regionDict[character.id];
      object[lang][regionDict[character.id]] = character.region;
    }
  }

  const filePath = path.join(DATA_DIR, `common.json`);
  const data = JSON.stringify(object, undefined, 2);

  try {
    fs.mkdirSync(path.dirname(filePath));
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.error(err);
      throw err;
    }

    fs.writeFileSync(filePath, data);
  }
}

const localeToLang = (locale) => {
  switch (locale) {
    case "en":
      return "english";
    case "es":
      return "spanish";
    case "ja":
      return "japanese";
    case "zh-tw":
      return "chinese-traditional";
    case "de":
      return "german";
    case "fr":
      return "french";
    case "id":
      return "indonesian";
    case "it":
      return "italian";
    case "ko":
      return "korean";
    case "pt":
      return "portuguese";
    case "ru":
      return "russian";
    case "th":
      return "thai";
    case "tr":
      return "turkish";
    case "vi":
      return "vietnamese";

    default:
      return "english";
  }
};

generateBuilds();
