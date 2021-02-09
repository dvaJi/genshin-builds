import { memo, useState } from "react";
import { useDrop } from "react-dnd";
import { useSetRecoilState } from "recoil";
import Image from "next/image";

import { Artifact } from "../interfaces/artifacts";
import { Character } from "../interfaces/character";
import { compBuildState } from "../state/comp-builder-atoms";

interface CharacterBuildArtifactsProps {
  artifactSelected: string[];
  artifactsList: Record<string, Artifact>;
  character: Character;
  positionKey: string;
}

const CharacterBuildArtifacts = ({
  artifactSelected,
  artifactsList,
  character,
  positionKey,
}: CharacterBuildArtifactsProps) => {
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
  let border = "3px solid transparent";
  if (isActive) {
    backgroundColor = "rgba(0, 0, 0, 0.6)";
    border = "3px dashed black";
  } else if (canDrop) {
    backgroundColor = "rgba(0, 0, 0, 0.4)";
    border = "3px dashed black";
  }

  return (
    <div
      ref={drop}
      className="rounded-md"
      style={{
        backgroundColor,
        border,
        minWidth: "4rem",
        minHeight: "10rem",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="grid grid-cols-4 gap-4">
        {artifactSelected.map((key) => (
          <div
            key={key}
            className="border-gray-800 border-4 w-16 h-16 bg-vulcan-900 relative"
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
            <Image
              src={`/_assets/artifacts/${artifactsList[key].name
                .toLowerCase()
                .replace(/\s/g, "_")}.png`}
              width={56}
              height={56}
            />
            {/* <span className="text-white text-xs">{artifactsList[key].name}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(CharacterBuildArtifacts);
