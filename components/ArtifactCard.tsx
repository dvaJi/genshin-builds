import { memo } from "react";
import Image from "next/image";
import { Artifact } from "genshin-data";

interface ArtifactCardProps {
  artifact: Artifact;
  recommendedStats?: string[];
  pieces: 2 | 4;
}

const ArtifactCard = ({
  artifact,
  recommendedStats,
  pieces,
}: ArtifactCardProps) => {
  return (
    <div className="bg-vulcan-900 border border-vulcan-900 mb-2 rounded p-3 mr-1">
      <div className="flex items-center relative mb-3">
        <div className="mr-2">
          <Image
            src={`/_assets/artifacts/${artifact.id}.png`}
            height={60}
            width={60}
            alt={artifact.name}
          />
        </div>
        <div>
          <div className="font-bold text-white">{artifact.name}</div>
          {recommendedStats && (
            <div className="text-white text-sm">
              {recommendedStats.join(" / ")}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-start mb-3">
        <div className="text-white mr-1 font-bold">(2)</div>
        <p>{artifact["2pc"]}</p>
      </div>
      {pieces === 4 && (
        <div className="flex items-start">
          <div className="text-white mr-1 font-bold">(4)</div>
          <p>{artifact["4pc"]}</p>
        </div>
      )}
    </div>
  );
};

export default memo(ArtifactCard);
