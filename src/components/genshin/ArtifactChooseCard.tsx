import { memo } from "react";
import clsx from "clsx";
import type { Artifact } from "genshin-data";
import Tooltip from "./Tooltip";
import { getUrl } from "@/lib/img";

interface ArtifactCardProps {
  artifacts: [Artifact & { children?: Artifact[] }];
  dict: Record<string, string>;
}

const ArtifactChooseCard = ({ artifacts, dict }: ArtifactCardProps) => {
  return (
    <div className="mb-2 mr-1 w-full rounded-md border border-vulcan-700 bg-vulcan-900">
      <h4 className="m-2 text-xs">{dict["choose_2"]}</h4>
      <div className="m-2 flex flex-row flex-wrap justify-between">
        {artifacts.map((artifact) => (
          <Tooltip
            key={artifact.id}
            className="mb-2"
            contents={
              <div className="p-2 text-sm">
                {artifact.children ? (
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
                  "flex items-center justify-center rounded-lg bg-cover p-1 lg:flex-none"
                )}
                style={{
                  backgroundImage: `url(${getUrl(
                    `/bg_${artifact.max_rarity}star.png`
                  )})`,
                }}
              >
                <img
                  src={getUrl(`/artifacts/${artifact.id}.png`, 48, 48)}
                  height={24}
                  width={24}
                  className="h-9 w-9"
                  alt={artifact.name}
                />
              </div>
              <div className="relative flex items-center p-2">
                <div className="font-bold text-white">{artifact.name}</div>
                <div className="ml-2 rounded-md bg-vulcan-600 p-1 px-2 text-xs font-semibold text-gray-200">
                  2
                </div>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default memo(ArtifactChooseCard);
