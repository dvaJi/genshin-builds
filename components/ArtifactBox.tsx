import { memo } from "react";
import { useDrag, DragSourceMonitor } from "react-dnd";
import { useSetRecoilState } from "recoil";
import Image from "next/image";

import { Artifact } from "../interfaces/artifacts";
import { compBuildState } from "../state/comp-builder-atoms";

interface ArtifactBoxProps {
  artifact: Artifact;
  isSelected: boolean;
}

const ArtifactBox = ({ artifact, isSelected }: ArtifactBoxProps) => {
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
          [dropResult.position]: {
            ...currComp[dropResult.position],
            a: [...currComp[dropResult.position].a, artifact.id],
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
      <div className="border-gray-400 dark:border-gray-800 border-4 w-16 h-16 m-auto">
        <Image
          src={`/artifacts/${artifact.name
            .toLowerCase()
            .replace(/\s/g, "_")}.png`}
            height={56}
            width={56}
        />
      </div>
      <span className="text-gray-800 dark:text-gray-500 text-sm">
        {artifact.name}
      </span>
    </div>
  );
};

export default memo(ArtifactBox);
