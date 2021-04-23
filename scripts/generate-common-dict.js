const fs = require("fs-extra");
const path = require("path");
const GenshinData = require("genshin-data").default;

const DATA_DIR = path.join(__dirname, "..", "_content", "data");
const LANGUAGES = [
  "en",
  "es",
  "ja",
  "zh-tw",
  "de",
  "fr",
  "id",
  "ko",
  "pt",
  "ru",
  "th",
  "vi",
];

const charactersIds = [
  "zhongli",
  "venti",
  "keqing",
  "klee",
  "chongyun",
  "barbara",
];

const weaponsDict = {
  zhongli: "Polearm",
  venti: "Bow",
  keqing: "Sword",
  klee: "Catalyst",
  chongyun: "Claymore",
  barbara: "Catalyst",
};
const elementDict = {
  zhongli: "Geo",
  venti: "Anemo",
  keqing: "Electro",
  klee: "Pyro",
  chongyun: "Cryo",
  barbara: "Hydro",
};
const regionDict = {
  zhongli: "Liyue",
  venti: "Mondstadt",
  keqing: "Liyue",
  klee: "Mondstadt",
  chongyun: "Liyue",
  barbara: "Mondstadt",
};

async function generateBuilds() {
  for (const lang of LANGUAGES) {
    let object = {};
    const gdata = new GenshinData({ language: localeToLang(lang) });
    const characters = (await gdata.characters()).filter((c) =>
      charactersIds.includes(c.id)
    );

    for (const character of characters) {
      object[character.weapon_type] = weaponsDict[character.id];
      object[character.element] = elementDict[character.id];
      object[character.region] = regionDict[character.id];
    }

    // console.log(object);

    const filePath = path.join(DATA_DIR, `common_${lang}.json`);
    const data = JSON.stringify(object, undefined, 2);
    fs.ensureDirSync(path.dirname(filePath));
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
    case "ko":
      return "korean";
    case "pt":
      return "portuguese";
    case "ru":
      return "russian";
    case "th":
      return "thai";
    case "vi":
      return "vietnamese";

    default:
      return "english";
  }
};

generateBuilds();
