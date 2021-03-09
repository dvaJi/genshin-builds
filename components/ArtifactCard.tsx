import { memo } from "react";
import Image from "next/image";
import { Artifact } from "genshin-data";

interface ArtifactCardProps {
  artifact: Artifact;
  pieces: 2 | 4;
}

const ArtifactCard = ({ artifact, pieces }: ArtifactCardProps) => {
  return (
    <div className="bg-vulcan-800 border border-vulcan-700 mb-2 rounded p-3 mr-1 w-full">
      <div className="flex flex-row">
        <div className="md:flex-none mr-2">
          <Image
            src={`/_assets/artifacts/${artifact.id}.png`}
            height={76}
            width={76}
            alt={artifact.name}
          />
        </div>
        <div>
          <div className="flex items-center relative mb-2">
            <div>
              <div className="font-bold text-white">{artifact.name}</div>
            </div>
          </div>
          <div className="flex items-start mb-1 -ml-10 md:ml-0">
            <div className="text-white mr-1 font-bold">(2)</div>
            <p>{artifact["2pc"]}</p>
          </div>
          {pieces === 4 && (
            <div className="flex items-start -ml-10 md:ml-0">
              <div className="text-white mr-1 font-bold">(4)</div>
              <p>{artifact["4pc"]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ArtifactCard);
