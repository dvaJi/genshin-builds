import { useDrag, DragSourceMonitor } from "react-dnd";
import { useSetRecoilState } from "recoil";

import { Artifact } from "../interfaces/artifacts";
import { compBuildState } from "../state/comp-builder-atoms";

interface ArtifactBoxProps {
  artifact: Artifact;
  isSelected: boolean;
}

export const ArtifactBox: React.FC<ArtifactBoxProps> = ({
  artifact,
  isSelected,
}) => {
  const setCompBuild = useSetRecoilState(compBuildState);
  const [{ isDragging }, drag] = useDrag({
    item: { name: artifact.name, type: "artifact" },
    end: (item: { name: string } | undefined, monitor: DragSourceMonitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(
          `You dropped a weapon: ${item.name} into ${dropResult.name}!`,
          item,
          dropResult
        );
        setCompBuild((currComp) => ({
          ...currComp,
          [dropResult.characterId]: {
            w: currComp[dropResult.characterId].w,
            a: [...currComp[dropResult.characterId].a, artifact.id],
          },
        }));
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging || isSelected ? 0.4 : 1;
  const pointerEvents = isSelected ? "none" : "initial";

  return (
    <div ref={drag} style={{ opacity, pointerEvents }} className="text-center">
      <div className="border-gray-800 border-4 w-16 h-16 m-auto">
        <img
          src={`https://rerollcdn.com/GENSHIN/Gear/${artifact.name
            .toLowerCase()
            .replace(/\s/g, "_")}.png`}
        />
      </div>
      <span className="text-white text-sm">{artifact.name}</span>
    </div>
  );
};
