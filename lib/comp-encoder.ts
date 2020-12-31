import { CharacterBuild } from "../state/comp-builder-atoms";
import hexyjs from "hexyjs";

export const EMPTY_COMP = "7c7e2c7c7e2c7c7e2c7c7e";

export const encodeComp = (value: Record<string, CharacterBuild>): string => {
  const str = Object.keys(value)
    .map((k) => `${value[k].i}|${value[k].w}~${value[k].a.join(";")}`)
    .join(",");

  const encoded = hexyjs.strToHex(str);

  if (encoded === EMPTY_COMP) {
    return "";
  }

  return encoded;
};

export const decodeComp = (
  value: string = ""
): [Record<string, CharacterBuild>, number] => {
  const ch = hexyjs.hexToStr(value) || "";
  const keys = ch.split(",");
  let comp: Record<string, CharacterBuild> = {};
  let compsCount = 0;

  keys.forEach((k, i) => {
    const [key, rest] = k.split("|");
    const [w, a] = rest.split("~");
    comp[i] = {
      i: key,
      w: w || "",
      a: a ? a.split(";") : [],
    };

    if (key) {
      compsCount++;
    }
  });

  return [comp, compsCount];
};
