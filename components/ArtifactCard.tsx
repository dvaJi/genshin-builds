import { memo } from "react";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Artifact } from "genshin-data";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { getUrl } from "@lib/imgUrl";
import useIntl from "@hooks/use-intl";

const Tooltip = dynamic(() => import("./Tooltip"), {
  ssr: false,
});

interface ArtifactCardProps {
  artifact: Artifact & { children?: Artifact[] };
  artifact2?: Artifact & { children?: Artifact[] };
}

const ArtifactCard = ({ artifact, artifact2 }: ArtifactCardProps) => {
  const { t } = useIntl("character");
  const has2Sets = artifact2 !== undefined;

  const artifacts = has2Sets ? [artifact, artifact2] : [artifact];

  return (
    <div className="bg-vulcan-900 border border-vulcan-700 mb-2 rounded-md mr-1 w-full">
      <div className="flex flex-row justify-between m-px border-b border-gray-800">
        {artifacts.map((artifact, index) => (
          <Tooltip
            key={artifact.id}
            contents={
              <div className="p-2 text-sm">
                {artifact.children ? (
                  artifact.children.map((ca, i) => (
                    <div
                      key={ca.id + artifact.id}
                      className={clsx("py-1 border-gray-600 block", {
                        "border-b": i + 1 < artifact.children!.length,
                      })}
                    >
                      <LazyLoadImage
                        src={getUrl(`/artifacts/${ca.id}.png`, 76, 76)}
                        height={32}
                        width={32}
                        className="h-8 ml-1 mr-2 inline-block"
                        alt={artifact.name}
                      />
                      {ca.name}
                    </div>
                  ))
                ) : (
                  <>
                    <p className="py-2 border-b border-gray-600">
                      {artifact["two_pc"]}
                    </p>
                    <p className="py-2">{artifact["four_pc"]}</p>
                  </>
                )}
              </div>
            }
          >
            <div className="flex flex-col lg:flex-row h-full w-full">
              <div
                className={clsx(
                  "flex lg:flex-none bg-cover p-1 items-center justify-center",
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
                <LazyLoadImage
                  src={getUrl(`/artifacts/${artifact.id}.png`, 76, 76)}
                  height={40}
                  width={40}
                  className="w-11 h-11"
                  alt={artifact.name}
                />
              </div>
              <div className="flex items-center relative p-2">
                <div className="font-bold text-white">{artifact.name}</div>
                <div className="ml-2 text-xs font-semibold bg-vulcan-600 text-gray-200 p-1 px-2 rounded-md">
                  {has2Sets ? 2 : 4}
                </div>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>

      <div className="p-2 pl-3">
        <span className="text-xs">
          {t({ id: "bonus", defaultMessage: "Bonus" })}:
        </span>
        <div className="flex items-start mb-1">
          <div className="mr-2 text-xs font-semibold bg-vulcan-600 text-gray-200 p-1 px-2 rounded-md">
            2
          </div>
          <p>{artifact["two_pc"]}</p>
        </div>
        {has2Sets ? (
          <div className="flex items-start">
            <div className="mr-2 text-xs font-semibold bg-vulcan-600 text-gray-200 p-1 px-2 rounded-md">
              2
            </div>
            <p>{artifact2["two_pc"]}</p>
          </div>
        ) : (
          <div className="flex items-start">
            <div className="mr-2 text-xs font-semibold bg-vulcan-600 text-gray-200 p-1 px-2 rounded-md">
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
