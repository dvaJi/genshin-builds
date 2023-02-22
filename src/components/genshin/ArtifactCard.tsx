import { memo } from "react";
import clsx from "clsx";
import type { Artifact } from "genshin-data";

import Tooltip from "./Tooltip";

import { getUrl } from "@/lib/img";

interface ArtifactCardProps {
  dict: Record<string, string>;
  artifact: Artifact & { children?: Artifact[] };
  artifact2?: Artifact & { children?: Artifact[] };
}

const ArtifactCard = ({ dict, artifact, artifact2 }: ArtifactCardProps) => {
  const has2Sets = artifact2 !== undefined;

  const artifacts = has2Sets ? [artifact, artifact2] : [artifact];

  return (
    <div className="mb-2 mr-1 w-full rounded-md border border-vulcan-700 bg-vulcan-900">
      <div className="m-px flex flex-row justify-between border-b border-gray-800">
        {artifacts.map((artifact, index) => (
          <Tooltip
            key={artifact.id}
            contents={
              <div className="p-2 text-sm">
                {artifact?.children ? (
                  artifact.children.map((ca, i) => (
                    <div
                      key={ca.id + artifact.id}
                      className={clsx("block border-gray-600 py-1", {
                        "border-b": i + 1 < artifact.children!.length,
                      })}
                    >
                      <img
                        src={getUrl(`/artifacts/${ca.id}.png`, 76, 76)}
                        height={32}
                        width={32}
                        className="ml-1 mr-2 inline-block h-8"
                        alt={artifact.name}
                      />
                      {ca.name}
                    </div>
                  ))
                ) : (
                  <>
                    <p className="border-b border-gray-600 py-2">
                      {artifact["two_pc"]}
                    </p>
                    <p className="py-2">{artifact["four_pc"]}</p>
                  </>
                )}
              </div>
            }
          >
            <div className="flex h-full w-full flex-col lg:flex-row">
              <div
                className={clsx(
                  "flex items-center justify-center bg-cover p-1 lg:flex-none",
                  { "lg:rounded-tr-none": has2Sets },
                  { "rounded-tl-md": index === 0 },
                  { "rounded-tr-md": index === 1 || !has2Sets }
                )}
                style={{
                  backgroundImage: `url(${getUrl(
                    `/bg_${artifact.max_rarity}star.png`
                  )})`,
                }}
              >
                <img
                  src={getUrl(`/artifacts/${artifact.id}.png`, 76, 76)}
                  height={40}
                  width={40}
                  className="h-11 w-11"
                  alt={artifact.name}
                />
              </div>
              <div className="relative flex items-center p-2">
                <div className="font-bold text-white">{artifact.name}</div>
                <div className="ml-2 rounded-md bg-vulcan-600 p-1 px-2 text-xs font-semibold text-gray-200">
                  {has2Sets ? 2 : 4}
                </div>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="p-2 pl-3">
        <span className="text-xs">{dict["bonus"]}</span>
        <div className="mb-1 flex items-start">
          <div className="mr-2 rounded-md bg-vulcan-600 p-1 px-2 text-xs font-semibold text-gray-200">
            2
          </div>
          <p>{artifact["two_pc"]}</p>
        </div>
        {has2Sets ? (
          <div className="flex items-start">
            <div className="mr-2 rounded-md bg-vulcan-600 p-1 px-2 text-xs font-semibold text-gray-200">
              2
            </div>
            <p>{artifact2["two_pc"]}</p>
          </div>
        ) : (
          <div className="flex items-start">
            <div className="mr-2 rounded-md bg-vulcan-600 p-1 px-2 text-xs font-semibold text-gray-200">
              4
            </div>
            <p>{artifact["four_pc"]}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ArtifactCard);
