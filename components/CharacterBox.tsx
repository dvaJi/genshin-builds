import { memo } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { useSetRecoilState } from "recoil";
import { Character } from "../interfaces/character";
import { compBuildState } from "../state/comp-builder-atoms";

const borderColor = (tier: number) => {
  switch (tier) {
    case 1:
      return "#a86316";
    case 2:
      return "#731377";
    case 3:
      return "#2d3b86";
    case 4:
      return "#194a3c";
    case 5:
      return "#6a6fa3";
    default:
      return "#6a6fa3";
  }
};

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
      className="text-gray-800 dark:text-gray-500 cursor-move w-32 transition-all duration-200 ease-linear transform hover:scale-105 hover:text-black dark:hover:text-white"
    >
      <div>
        <svg
          className="rounded-full block w-20 h-20 p-1 m-auto"
          style={{ filter: "drop-shadow(rgba(0, 0, 0, 0.4) 0px 3px 5px)" }}
          role="img"
          viewBox="0 0 100 100"
        >
          <mask id="1620974646588227">
            <circle cx="50" cy="50" r="50" fill="white"></circle>
          </mask>
          <g mask="url(#1620974646588227)">
            <circle
              cx="50"
              cy="50"
              r="48"
              stroke="none"
              fill="#1d1345"
            ></circle>
            <image
              x="4"
              y="4"
              preserveAspectRatio="xMidYMid slice"
              href={`/characters/portrait/${character.name}.png`}
              width="96px"
              height="96px"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              strokeWidth="2px"
              fill="none"
              stroke="#000"
              vectorEffect="non-scaling-stroke"
            ></circle>
            <circle
              cx="50"
              cy="50"
              r="50"
              strokeWidth="5px"
              fill="none"
              stroke={borderColor(character.tier)}
              vectorEffect="non-scaling-stroke"
            ></circle>
            <rect
              x="17.7783"
              y="19.1914"
              width="24"
              height="2"
              transform="rotate(-135 17.7783 19.1914)"
              fill={borderColor(character.tier)}
            ></rect>
          </g>
        </svg>
      </div>
      <p className="text-center text-base">{character.name}</p>
    </div>
  );
};

export default memo(CharacterBox);
