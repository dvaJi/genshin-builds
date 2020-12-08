import { memo } from "react";
import { useDrop } from "react-dnd";
import { useSetRecoilState } from "recoil";

import CharacterBuildCard from "./CharacterBuildCard";
import CharacterBuildSekeleton from "./CharacterBuildSkeleton";

import { Artifact } from "../interfaces/artifacts";
import { Character } from "../interfaces/character";
import { Weapon } from "../interfaces/weapon";
import { ElementalResonance } from "../interfaces/elemental-resonance";

import { CharacterBuild, compBuildState } from "../state/comp-builder-atoms";

interface CharacterBuildBoxProps {
  artifactsList: Record<string, Artifact>;
  charactersList: Record<string, Character>;
  weaponsList: Record<string, Weapon>;
  teamBuild: Record<string, CharacterBuild>;
  positionKey: string;
  resonances: (ElementalResonance | undefined)[];
}

const CharacterBuildBox = ({
  artifactsList,
  charactersList,
  weaponsList,
  teamBuild,
  positionKey,
  resonances,
}: CharacterBuildBoxProps) => {
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "box",
    drop: () => ({ name: `Box`, position: positionKey }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      dropType: monitor.getItemType(),
    }),
  });

  const handleOnRemoveCharacter = () => {
    setCompBuild((currComp) => ({
      ...currComp,
      [positionKey]: { i: "", w: "", a: [] },
    }));
  };

  const characterBuild = teamBuild[positionKey];
  const character = charactersList[characterBuild.i];

  const hasElemResonance = resonances.find(
    (r) => r?.id === "7" || r?.primary[0] === character?.type
  );
  const isActive = canDrop && isOver;

  return (
    <div ref={drop}>
      {character ? (
        <CharacterBuildCard
          positionKey={positionKey}
          elementalResonance={hasElemResonance}
          character={character}
          artifactsList={artifactsList}
          weaponsList={weaponsList}
          teamBuild={teamBuild}
          isActive={isActive}
          onRemoveCharacter={handleOnRemoveCharacter}
        />
      ) : (
        <CharacterBuildSekeleton isActive={isActive} />
      )}
    </div>
  );
};

export default memo(CharacterBuildBox);
