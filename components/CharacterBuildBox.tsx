import { useState } from "react";
import { useDrop } from "react-dnd";
import { useSetRecoilState } from "recoil";
import { Artifact } from "../interfaces/artifacts";

import { Character } from "../interfaces/character";
import { Weapon } from "../interfaces/weapon";
import { CharacterBuild, compBuildState } from "../state/comp-builder-atoms";
import { CharacterBuildSekeleton } from "./CharacterBuildSkeleton";

interface CharacterBuildBoxProps {
  artifactsList: Record<string, Artifact>;
  charactersList: Record<string, Character>;
  weaponsList: Record<string, Weapon>;
  teamBuild: Record<string, CharacterBuild>;
  positionKey: string;
}

export const CharacterBuildBox: React.FC<CharacterBuildBoxProps> = ({
  artifactsList,
  charactersList,
  weaponsList,
  teamBuild,
  positionKey,
}) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "box",
    drop: () => ({ name: `Box`, position: positionKey }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveCharacter = () => {
    console.log(positionKey);
    setCompBuild((currComp) => ({
      ...currComp,
      [positionKey]: { i: "", w: "", a: [] },
    }));
  };

  const characterBuild = teamBuild[positionKey];
  const character = charactersList[characterBuild.i];

  const isActive = canDrop && isOver;
  let backgroundColor = "transparent";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div
      ref={drop}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ backgroundColor }}
    >
      {character ? (
        <div
          className="h-500px transition-all duration-200 ease-linear mx-1 border-gray-800 border-4 p-3 relative"
          style={{
            backgroundImage: `url('/characters/${character.name}.png'), url('/regions/${character.region}_d.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-white absolute right-0 mr-3">
            {isHover && (
              <button
                className="bg-vulcan-400 py-1 px-2 rounded-md"
                onClick={() => handleOnRemoveCharacter()}
              >
                X
              </button>
            )}
          </div>
          <span
            className="text-gray-100 font-bold text-3xl tracking-tighter uppercase inline-block"
            style={{ textShadow: "0px 0px 8px black" }}
          >
            <span>{character.name}</span>
            <img
              className="inline ml-3 align-baseline"
              src={`/elements/${character.type}.png`}
              height={20}
              width={20}
            />
          </span>
          <div className="mt-2">
            <WeaponComp
              weaponSelected={teamBuild[positionKey].w}
              weaponsList={weaponsList}
              character={character}
              positionKey={positionKey}
            />
          </div>
          <div className="mt-2">
            <ArtifactComp
              artifactSelected={teamBuild[positionKey].a}
              artifactsList={artifactsList}
              character={character}
              positionKey={positionKey}
            />
          </div>
        </div>
      ) : (
        <CharacterBuildSekeleton />
      )}
    </div>
  );
};

interface WeaponCompProps {
  weaponSelected: string;
  weaponsList: Record<string, Weapon>;
  character: Character;
  positionKey: string;
}

const WeaponComp = ({
  weaponSelected,
  weaponsList,
  character,
  positionKey,
}: WeaponCompProps) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: `weapon-${character.weapon}`,
    drop: () => ({
      name: "Weapons",
      position: positionKey,
      characterId: character.id,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveWeapon = () => {
    setCompBuild((currComp) => ({
      ...currComp,
      [positionKey]: { ...currComp[positionKey], w: "" },
    }));
  };

  const isActive = canDrop && isOver;
  let backgroundColor = "";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor }}
      className="border-gray-800 border-4 w-16 h-16 bg-gray-900 overflow-hidden relative"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {weaponSelected && (
        <div key={weaponSelected}>
          <div className="text-white text-xs absolute right-0 mr-1">
            {isHover && (
              <button
                className="bg-vulcan-400 py-1 px-2 rounded-md"
                onClick={() => handleOnRemoveWeapon()}
              >
                X
              </button>
            )}
          </div>
          <img
            src={`https://rerollcdn.com/GENSHIN/Weapon/NEW/${weaponsList[
              weaponSelected
            ].name.replace(/\s/g, "_")}.png`}
          />
          {/* {weaponsList[weaponSelected].name} */}
        </div>
      )}
    </div>
  );
};

interface ArtifactCompProps {
  artifactSelected: string[];
  artifactsList: Record<string, Artifact>;
  character: Character;
  positionKey: string;
}

const ArtifactComp = ({
  artifactSelected,
  artifactsList,
  character,
  positionKey,
}: ArtifactCompProps) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "artifact",
    drop: () => ({
      name: "Artifact",
      position: positionKey,
      characterId: character.id,
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveArtifact = (id: string) => {
    setCompBuild((currComp) => ({
      ...currComp,
      [positionKey]: {
        ...currComp[positionKey],
        a: currComp[positionKey].a.filter((w) => w !== id),
      },
    }));
  };

  const isActive = canDrop && isOver;
  let backgroundColor = "transparent";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }

  return (
    <div
      ref={drop}
      style={{ backgroundColor, minWidth: "4rem", minHeight: "10rem" }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="grid grid-cols-4 gap-4">
        {artifactSelected.map((key) => (
          <div
            key={key}
            className="border-gray-800 border-4 w-16 h-16 bg-gray-900 relative"
          >
            <div className="text-white text-xs absolute right-0 mr-1">
              {isHover && (
                <button
                  className="bg-vulcan-400 py-1 px-2 rounded-md"
                  onClick={() => handleOnRemoveArtifact(key)}
                >
                  X
                </button>
              )}
            </div>
            <img
              src={`https://rerollcdn.com/GENSHIN/Gear/${artifactsList[key].name
                .toLowerCase()
                .replace(/\s/g, "_")}.png`}
            />
            {/* {artifactsList[key].name} */}
          </div>
        ))}
      </div>
    </div>
  );
};
