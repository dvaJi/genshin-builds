import fs from "fs";
import { Build } from "interfaces/tof/build";
import { join } from "path";

const TOF_DATA_PATH = join(process.cwd(), "_content", "tof", "data");

export function getBuildsByCharacterId(characterId: string): Build[] {
  const data = fs.readFileSync(join(TOF_DATA_PATH, "builds.json"), "utf8");
  return JSON.parse(data)[characterId] || [];
}
