import { useEffect, useMemo, useState } from "react";
import { GetStaticProps } from "next";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import hexyjs from "hexyjs";

import {
  CharacterBuild,
  compBuildState,
  elementalResonancesState,
} from "../state/comp-builder-atoms";
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
import elementalResonancesData from "../utils/elemental_resonance.json";
import { ElementalResonance } from "../interfaces/elemental-resonance";

type Props = {
  artifacts: Artifact[];
  characters: Character[];
  weapons: Weapon[];
  elementalResonances: ElementalResonance[];
};

const CompBuilder = ({
  artifacts,
  characters,
  weapons,
  elementalResonances,
}: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState("CHARACTERS");
  const [characterList, set] = useRecoilState(compBuildState);
  const setelementalResonance = useSetRecoilState(elementalResonancesState);

  useEffect(() => {
    setelementalResonance(elementalResonances);
  });

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

  const hasDuplicates = (array: string[]) => {
    return new Set(array).size !== array.length;
  };

  const hasUndefined = (array: string[]) => {
    return array.filter((v) => v === undefined).length > 0;
  };

  const currentElementalResonance = useMemo(() => {
    const types = [
      charactersMap[characterList[0]?.i]?.type,
      charactersMap[characterList[1]?.i]?.type,
      charactersMap[characterList[2]?.i]?.type,
      charactersMap[characterList[3]?.i]?.type,
    ];

    if (!hasDuplicates(types) && !hasUndefined(types)) {
      return [elementalResonances.find((er) => er.id === "7")];
    } else if (hasDuplicates(types)) {
      const resonances = elementalResonances.filter((er) => {
        if (er.id === "7") {
          return false;
        }

        const [el1, el2] = er.primary;
        let el1Found = false;
        let el2Found = false;

        types.forEach((t) => {
          if (el1Found) {
            if (t === el2) {
              el2Found = true;
            }
          } else {
            if (t === el1) {
              el1Found = true;
            }
          }
        });

        return el1Found && el2Found;
      });

      return resonances;
    } else {
      return [];
    }
  }, [characterList]);

  const { map } = router.query;

  useEffect(() => {
    const charactersBuilded = Object.keys(characterList).reduce<number>(
      (a, c) => {
        if (characterList[c].i) {
          a++;
        }
        return a;
      },
      0
    );
    const charactersJoin = Object.keys(characterList)
      .map(
        (k) =>
          `${characterList[k].i}|${characterList[k].w}~${characterList[
            k
          ].a.join(";")}`
      )
      .join(",");

    if (map) {
      const ch = hexyjs.hexToStr(map as string) || "";
      // console.log("decoded string", ch);
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

      if (charactersBuilded === 0 && compsCount > 0) {
        set(() => comp);
      } else {
        // TODO: don't add generated uuid if comp is empty
        const generateUuid = hexyjs.strToHex(charactersJoin);
        router.push({
          pathname: "/comp-builder",
          query: { map: generateUuid },
        });
      }
    }
  }, [map]);

  useEffect(() => {
    const charactersJoin = Object.keys(characterList)
      .map(
        (k) =>
          `${characterList[k].i}|${characterList[k].w}~${characterList[
            k
          ].a.join(";")}`
      )
      .join(",");
    const generateUuid = hexyjs.strToHex(charactersJoin);
    router.push({
      pathname: "/comp-builder",
      query: { map: generateUuid },
    });
  }, [characterList]);

  return (
    <div>
      <div>
        <div className="grid grid-cols-4 gap-4 h-500px min-w-full mt-2">
          {Object.keys(characterList).map((key) => (
            <CharacterBuildBox
              key={key}
              artifactsList={artifactsMap}
              charactersList={charactersMap}
              weaponsList={weaponsMap}
              teamBuild={characterList}
              positionKey={key}
              resonances={currentElementalResonance}
            />
          ))}
        </div>
        <div className="min-w-0 p-4 mt-4 rounded-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-vulcan-800 relative pt-16">
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
                characterList={characterList}
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
  characterList: Record<string, CharacterBuild>;
}) => {
  const [elementFilter, setElementFilter] = useState("");
  const charactersIds = Object.keys(characterList)
    .reduce<string[]>((r, c) => [...r, characterList[c].i], [])
    .filter((i) => i.length > 0);
  return (
    <div className="grid grid-cols-9 gap-3">
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
              charactersIds.includes(character.id.toString()) ||
              charactersIds.length === 4
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
  const elementalResonances = elementalResonancesData as ElementalResonance[];
  return {
    props: { artifacts, characters, weapons, elementalResonances },
    revalidate: 1,
  };
};

export default CompBuilder;
