"use client";

import clsx from "clsx";
import { Fragment } from "react";
import { Tooltip } from "react-tooltip";

import type { Artifact } from "@interfaces/genshin";

import Image from "./Image";

interface ArtifactCardProps {
  position: number;
  artifacts: (Artifact & { children?: Artifact[] })[];
  isChooseTwo?: boolean;
  messages: {
    choose_2: string;
  };
}

const ArtifactCard = ({
  position,
  artifacts,
  isChooseTwo,
  messages,
}: ArtifactCardProps) => {
  return (
    <div className="mb-2 mr-1 rounded-md border border-vulcan-700 bg-vulcan-900">
      <div className="flex px-4">
        <div className="mr-3 flex items-center">
          {isChooseTwo ? (
            <span className="whitespace-nowrap rounded bg-vulcan-600 p-1 text-xxs text-slate-300">
              {isChooseTwo ? messages.choose_2 : ""}
            </span>
          ) : (
            <span className="rounded bg-vulcan-600 p-1 text-xs text-slate-300">
              {position}
            </span>
          )}
        </div>
        <div className="m-px flex flex-row flex-wrap justify-between border-b border-gray-800">
          {artifacts.map((artifact, i) => (
            <Fragment key={artifact.id}>
              <Tooltip
                id={`${i}_${artifact.id}`}
                className="max-w-96"
                place="left"
              >
                <div className="p-2 text-sm text-slate-200">
                  {artifact?.children ? (
                    artifact.children.map((ca, i) => (
                      <div
                        key={ca.id + artifact.id}
                        className={clsx("block border-gray-600 py-1", {
                          "border-b": i + 1 < artifact.children!.length,
                        })}
                      >
                        <Image
                          src={`/artifacts/${ca.id}.png`}
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
                      <div className="flex">
                        <Image
                          src={`/artifacts/${artifact.id}.png`}
                          height={32}
                          width={32}
                          className="ml-1 mr-2 inline-block h-8"
                          alt={artifact.name}
                        />
                        <div className="text-lg font-semibold">
                          {artifact.name}
                        </div>
                      </div>
                      <p className="border-b border-gray-600 py-2">
                        <span className="mr-2 rounded bg-yellow-950 p-1 text-xs">
                          2
                        </span>
                        {artifact["two_pc"]}
                      </p>
                      <p className="py-2">
                        <span className="mr-2 rounded bg-yellow-950 p-1 text-xs">
                          4
                        </span>
                        {artifact["four_pc"]}
                      </p>
                    </>
                  )}
                </div>
              </Tooltip>
              <div
                className={clsx(isChooseTwo ? "max-w-[200px]" : "")}
                data-tooltip-id={`${i}_${artifact.id}`}
              >
                <div className="flex max-w-xs flex-row">
                  <div
                    className={clsx(
                      "flex flex-shrink-0 items-center justify-center bg-cover p-1",
                      `genshin-bg-rarity-${artifact.max_rarity}`
                    )}
                  >
                    <Image
                      src={`/artifacts/${artifact.id}.png`}
                      height={44}
                      width={44}
                      className="aspect-square"
                      alt={artifact.name}
                    />
                  </div>
                  <div className="relative flex items-center p-2">
                    <div className="font-semibold text-white">
                      {artifact.name}
                    </div>
                    <div className="ml-2 rounded-md bg-vulcan-800 p-1 px-2 text-xs font-semibold text-gray-400">
                      {artifacts.length > 1 ? 2 : 4}
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtifactCard;
