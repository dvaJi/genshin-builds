import Image from "next/image";
import { memo } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { useSetRecoilState } from "recoil";
import { Character } from "../interfaces/character";
import { compBuildState } from "../state/comp-builder-atoms";
import ElementIcon from "./ElementIcon";

interface CharacterBoxProps {
  character: Character;
  isSelected: boolean;
}

const CharacterBox: React.FC<CharacterBoxProps> = ({
  character,
  isSelected,
}) => {
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ isDragging }, drag] = useDrag({
    item: { name: character.name, type: "box" },
    end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(`You dropped ${item.name} into ${dropResult.name}!`);
        setCompBuild((currComp) => ({
          ...currComp,
          [dropResult.position]: { i: character.id, a: [], w: "" },
        }));
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const blockBox = isSelected || character.soon;
  const opacity = isDragging || blockBox ? 0.4 : 1;
  const pointerEvents = blockBox ? "none" : "initial";

  return (
    <div
      ref={drag}
      style={{ opacity, pointerEvents }}
      className="text-gray-500 cursor-move w-32 transition-all duration-200 ease-linear transform hover:scale-105 hover:text-white"
    >
      <div>
        <div className="text-center relative">
          <Image
            className="rounded-full shadow-lg"
            src={`/_assets/characters/portrait/${character.name}.png`}
            width={80}
            height={80}
          />
          <div className="absolute top-0 right-5 bg-vulcan-800 pt-1 px-1 rounded-full">
            <ElementIcon width={20} height={20} type={character.type} />
          </div>
        </div>
      </div>
      <p className="text-center text-base">{character.name}</p>
    </div>
  );
};

export default memo(CharacterBox);
