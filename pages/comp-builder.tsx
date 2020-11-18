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
import { Button } from "../components/Button";

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
        <div className="min-w-0 p-4 mt-4 rounded-lg shadow-xs bg-vulcan-800 relative pt-16">
          <div className="absolute -mt-12">
            <Button
              isActive={tab === "CHARACTERS"}
              className="rounded-l"
              onClick={() => setTab("CHARACTERS")}
            >
              Characters
            </Button>
            <Button
              isActive={tab === "WEAPONS"}
              onClick={() => setTab("WEAPONS")}
            >
              Weapons
            </Button>
            <Button
              isActive={tab === "ARTIFACTS"}
              className="rounded-r"
              onClick={() => setTab("ARTIFACTS")}
            >
              Artifacts
            </Button>
          </div>
          <div className="mt-4">
            {tab === "CHARACTERS" && (
              <CharactersContent
                characters={characters}
                characterList={charactersMap}
              />
            )}
            {tab === "WEAPONS" && <WeaponsContent weapons={weapons} />}
            {tab === "ARTIFACTS" && <ArtifactsContent artifacts={artifacts} />}
          </div>
        </div>
      </div>
    </div>
  );
};

const CharactersContent = ({
  characters,
  characterList,
}: {
  characters: Character[];
  characterList: Record<string, Character>;
}) => {
  const [elementFilter, setElementFilter] = useState("");
  return (
    <div className="grid grid-cols-8 gap-4">
      <div className="absolute -mt-16 right-0">
        {["Anemo", "Cryo", "Electro", "Dendro", "Geo", "Hydro", "Pyro"].map(
          (element) => (
            <Button
              key={element}
              className="inline-block mr-2 rounded"
              isActive={elementFilter === element}
              type="outline"
              color="secondary"
              onClick={() => {
                setElementFilter(element !== elementFilter ? element : "");
              }}
            >
              <img src={`/elements/${element}.png`} height={30} width={30} />
            </Button>
          )
        )}
      </div>
      {characters
        .filter((c) => (elementFilter ? c.type === elementFilter : true))
        .map((character) => (
          <CharacterBox
            key={character.id}
            character={character}
            isSelected={
              Object.keys(characterList).includes(character.id.toString()) ||
              Object.keys(characterList).length === 4
            }
          />
        ))}
    </div>
  );
};

const WeaponsContent = ({ weapons }: { weapons: Weapon[] }) => {
  const [typeFilter, setTypeFilter] = useState("");
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="absolute -mt-16 right-0">
        {["Bow", "Catalyst", "Claymore", "Polearm", "Sword"].map((type) => (
          <Button
            key={type}
            className="inline-block mr-2 rounded"
            isActive={typeFilter === type}
            type="outline"
            color="secondary"
            onClick={() => {
              setTypeFilter(type !== typeFilter ? type : "");
            }}
          >
            <img
              src={`https://rerollcdn.com/GENSHIN/Weapon/NEW/${type}.png`}
              height={30}
              width={30}
            />
          </Button>
        ))}
      </div>
      {weapons
        .filter((w) => (typeFilter ? w.type === typeFilter : true))
        .map((weapon) => (
          <WeaponBox key={weapon.id} weapon={weapon} isSelected={false} />
        ))}
    </div>
  );
};

const ArtifactsContent = ({ artifacts }: { artifacts: Artifact[] }) => {
  return (
    <div className="grid grid-cols-10 gap-1">
      {artifacts.map((artifact) => (
        <ArtifactBox key={artifact.id} artifact={artifact} isSelected={false} />
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const artifacts = artifactsData as Artifact[];
  const weapons = weaponsData as Weapon[];
  const characters = charactersData as Character[];
  return { props: { artifacts, characters, weapons }, revalidate: 1 };
};

export default CompBuilder;
