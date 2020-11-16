import { useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import hexyjs from "hexyjs";

import { CharacterBuild, compBuildState } from "../state/comp-builder-atoms";
import { Artifact } from "../interfaces/artifacts";
import { Character } from "../interfaces/character";
import { Weapon } from "../interfaces/weapon";

import { ArtifactBox } from "../components/ArtifactBox";
import { CharacterBuildBox } from "../components/CharacterBuildBox";
import CharacterBox from "../components/CharacterBox";
import { WeaponBox } from "../components/WeaponBox";

import artifactsData from "../utils/artifacts.json";
import charactersData from "../utils/characters.json";
import weaponsData from "../utils/weapons.json";

type Props = {
  artifacts: Artifact[];
  characters: Character[];
  weapons: Weapon[];
};

const CompBuilder = ({ artifacts, characters, weapons }: Props) => {
  const [tab, setTab] = useState("CHARACTERS");
  const [characterList, set] = useRecoilState(compBuildState);
  const router = useRouter();
  const charactersMap = useMemo(
    () =>
      characters.reduce<Record<string, Character>>(
        (acc, val) => Object.assign(acc, { [val.id]: val }),
        {}
      ),
    []
  );
  const weaponsMap = useMemo(
    () =>
      weapons.reduce<Record<string, Weapon>>(
        (acc, val) => Object.assign(acc, { [val.id]: val }),
        {}
      ),
    []
  );
  const artifactsMap = useMemo(
    () =>
      artifacts.reduce<Record<string, Artifact>>(
        (acc, val) => Object.assign(acc, { [val.id]: val }),
        {}
      ),
    []
  );
  const { map } = router.query;

  useEffect(() => {
    const charactersJoin = Object.keys(characterList)
      .map((k) => `${k}|${characterList[k].w}~${characterList[k].a.join(";")}`)
      .join(",");

    console.log(map, charactersJoin, map && !charactersJoin);
    if (map && !charactersJoin) {
      const ch = hexyjs.hexToStr(map as string) || "";
      console.log("decoded string", ch);
      const keys = ch.split(",");
      let comp: Record<string, CharacterBuild> = {};

      keys.forEach((k) => {
        const [key, rest] = k.split("|");
        const [w, a] = rest.split("~");
        comp[key] = {
          w: w || "",
          a: a ? a.split(";") : [],
        };
      });

      set(() => comp);
    } else {
      const generateUuid = hexyjs.strToHex(charactersJoin);
      router.push({ pathname: "/comp-builder", query: { map: generateUuid } });
    }
  }, [characterList, map]);

  console.log(characterList);

  return (
    <div>
      <div>
        <CharacterBuildBox
          artifactsList={artifactsMap}
          charactersList={charactersMap}
          weaponsList={weaponsMap}
          teamBuild={characterList}
        />
        <div className="min-w-0 p-4 mt-4 rounded-lg shadow-xs bg-vulcan-800">
          <div>
            <button onClick={() => setTab("CHARACTERS")}>Characters</button>
            <button onClick={() => setTab("WEAPONS")}>Weapons</button>
            <button onClick={() => setTab("ARTIFACTS")}>Artifacts</button>
          </div>
          <div>
            {tab === "CHARACTERS" && (
              <div className="grid grid-cols-8 gap-4">
                {characters.map((character) => (
                  <CharacterBox
                    key={character.id}
                    character={character}
                    isSelected={
                      Object.keys(characterList).includes(
                        character.id.toString()
                      ) || Object.keys(characterList).length === 4
                    }
                  />
                ))}
              </div>
            )}
            {tab === "WEAPONS" && (
              <div className="grid grid-cols-12 gap-4">
                {weapons.map((weapon) => (
                  <WeaponBox
                    key={weapon.id}
                    weapon={weapon}
                    isSelected={false}
                  />
                ))}
              </div>
            )}
            {tab === "ARTIFACTS" && (
              <div className="grid grid-cols-10 gap-1">
                {artifacts.map((artifact) => (
                  <ArtifactBox
                    key={artifact.id}
                    artifact={artifact}
                    isSelected={false}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const artifacts = artifactsData as Artifact[];
  const weapons = weaponsData as Weapon[];
  const characters = charactersData as Character[];
  return { props: { artifacts, characters, weapons } };
};

export default CompBuilder;
