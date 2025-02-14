"use client";

import clsx from "clsx";
import Link from "next/link";
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
  locale: string;
}

const ArtifactCard = ({
  position,
  artifacts,
  isChooseTwo,
  messages,
  locale,
}: ArtifactCardProps) => {
  return (
    <div className="mb-2 flex w-full rounded-md border border-border px-2 transition-all hover:bg-card hover:shadow-md sm:px-4">
      <div className="mr-1 flex items-center sm:mr-2">
        {isChooseTwo ? (
          <span className="mr-1 whitespace-nowrap rounded bg-muted p-1 text-xs text-muted-foreground sm:mr-2">
            {isChooseTwo ? messages.choose_2 : ""}
          </span>
        ) : (
          <span className="mr-1 rounded bg-muted p-1 text-xs text-muted-foreground sm:mr-2">
            {position}
          </span>
        )}
      </div>
      <div className="m-px flex flex-row flex-wrap justify-between">
        {artifacts.map((artifact, i) => (
          <Fragment key={artifact.id}>
            <Tooltip
              id={`${i}_${artifact.id}`}
              className="max-w-96 bg-background"
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
            <Link
              href={
                artifact.children?.length
                  ? "#"
                  : `/${locale}/artifacts/${artifact.id}`
              }
              className={clsx(isChooseTwo ? "max-w-[200px]" : "")}
              data-tooltip-id={`${i}_${artifact.id}`}
            >
              <div className="flex max-w-xs flex-row">
                <div
                  className={clsx(
                    "flex flex-shrink-0 items-center justify-center bg-cover p-0.5 sm:p-1",
                    `genshin-bg-rarity-${artifact.max_rarity}`,
                  )}
                >
                  <Image
                    src={`/artifacts/${artifact.id}.png`}
                    height={44}
                    width={44}
                    className="h-10 w-10 sm:h-11 sm:w-11"
                    alt={artifact.name}
                  />
                </div>
                <div className="relative flex items-center p-1 sm:p-2">
                  <div className="text-sm font-semibold text-white sm:text-base">
                    {artifact.name}
                  </div>
                  <div className="ml-1 mr-1 rounded-md bg-muted p-1 text-xs text-muted-foreground sm:ml-2 sm:mr-2">
                    {artifacts.length > 1 ? 2 : 4}
                  </div>
                </div>
              </div>
            </Link>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ArtifactCard;
