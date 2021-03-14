const fs = require("fs-extra");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "_content", "data");

async function generateBuilds() {
  let object = {};
  fs.readdirSync(path.join(DATA_DIR, "builds")).forEach((filename) => {
    const data = require(path.join(DATA_DIR, "builds", filename));
    object[filename.replace(".json", "")] = data;
  });

  const filePath = path.join(DATA_DIR, "builds.json");
  const data = JSON.stringify(object, undefined, 2);
  fs.ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, data);
}

generateBuilds();
