const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "_content", "locale");
const LOCALE_DIR = path.join(__dirname, "..", "locales");
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

async function generateLocale() {
  for (const lang of LANGUAGES) {
    const common = require(path.join(DATA_DIR, `common_${lang}.json`));
    const tmpLocale = require(path.join(DATA_DIR, `${lang}.json`));

    const object = { ...tmpLocale, ...common };

    const filePath = path.join(LOCALE_DIR, `${lang}.json`);
    const data = JSON.stringify(object, undefined, 2);
    fs.writeFileSync(filePath, data);
  }
}

generateLocale();
