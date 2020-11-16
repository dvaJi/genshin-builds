import { useState } from "react";
import { useDrop } from "react-dnd";
import { useSetRecoilState } from "recoil";
import { Artifact } from "../interfaces/artifacts";

import { Character } from "../interfaces/character";
import { Weapon } from "../interfaces/weapon";
import { CharacterBuild, compBuildState } from "../state/comp-builder-atoms";

interface CharacterBuildBoxProps {
  artifactsList: Record<string, Artifact>;
  charactersList: Record<string, Character>;
  weaponsList: Record<string, Weapon>;
  teamBuild: Record<string, CharacterBuild>;
}

export const CharacterBuildBox: React.FC<CharacterBuildBoxProps> = ({
  artifactsList,
  charactersList,
  weaponsList,
  teamBuild,
}) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "box",
    drop: () => ({ name: "Dustbin" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveCharacter = (id: string) => {
    setCompBuild((currComp) => {
      let state = { ...currComp };
      if (state[id]) {
        delete state[id];
      }

      return state;
    });
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
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{ backgroundColor }}
      className="mt-2"
    >
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(teamBuild).map((key) => (
          <div
            key={key}
            className="transition-all duration-200 ease-linear h-500px mx-1 border-gray-800 border-4 p-3 relative"
            style={{
              backgroundImage: `url('/characters/${charactersList[key].name}.png'), url('/regions/${charactersList[key].region}_d.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="text-white absolute right-0 mr-3">
              {isHover && (
                <button
                  className="bg-vulcan-400 py-1 px-2 rounded-md"
                  onClick={() => handleOnRemoveCharacter(key)}
                >
                  X
                </button>
              )}
            </div>
            {/* <img
              src={`https://rerollcdn.com/GENSHIN/Characters/${charactersList[key].name}.png`}
            /> */}
            <span
              className="text-gray-100 font-bold text-3xl tracking-tighter uppercase inline-block"
              style={{ textShadow: "0px 0px 8px black" }}
            >
              <span>{charactersList[key].name}</span>
              <img
                className="inline ml-3 align-baseline"
                src={`/elements/${charactersList[key].type}.png`}
                height={20}
                width={20}
              />
            </span>
            <div className="mt-2">
              <WeaponComp
                weaponSelected={teamBuild[key].w}
                weaponsList={weaponsList}
                character={charactersList[key]}
              />
            </div>
            <div className="mt-2">
              <ArtifactComp
                artifactSelected={teamBuild[key].a}
                artifactsList={artifactsList}
                character={charactersList[key]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface WeaponCompProps {
  weaponSelected: string;
  weaponsList: Record<string, Weapon>;
  character: Character;
}

const WeaponComp = ({
  weaponSelected,
  weaponsList,
  character,
}: WeaponCompProps) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: `weapon-${character.weapon}`,
    drop: () => ({ name: "Weapons", characterId: character.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveWeapon = (id: string) => {
    setCompBuild((currComp) => {
      let state = { ...currComp };
      if (state[character.id]) {
        state[character.id] = {
          ...state[character.id],
          w: "",
        };
      }

      return state;
    });
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
                onClick={() => handleOnRemoveWeapon(weaponSelected)}
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
}

const ArtifactComp = ({
  artifactSelected,
  artifactsList,
  character,
}: ArtifactCompProps) => {
  const [isHover, setIsHover] = useState(false);
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "artifact",
    drop: () => ({ name: "Artifact", characterId: character.id }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleOnRemoveArtifact = (id: string) => {
    setCompBuild((currComp) => {
      let state = { ...currComp };
      if (state[character.id]) {
        state[character.id] = {
          ...state[character.id],
          a: state[character.id].a.filter((w) => w !== id),
        };
      }

      return state;
    });
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
