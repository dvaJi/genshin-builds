"use client";

import clsx from "clsx";
import Link from "next/link";
import { Fragment, useState } from "react";
import { FaArrowDown } from "react-icons/fa6";

import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import Badge from "@components/ui/Badge";
import type { Artifact, Weapon } from "@interfaces/genshin";

export type BuildCardMessages = {
  show_build_details: string;
  hide_build_details: string;
  sands: string;
  goblet: string;
  circlet: string;
  best_weapons: string;
  best_artifacts: string;
  main_stats: string;
  substats: string;
};

type Props = {
  build: any;
  locale: string;
  messages: BuildCardMessages;
};

export default function BuildCard({ build, locale, messages }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div
      className={clsx(
        "card relative col-span-4 grid w-full grid-cols-12 gap-4 sm:col-span-2 lg:col-span-4",
        {
          "items-start ring ring-slate-600": isExpanded,
          "items-center": !isExpanded,
        }
      )}
    >
      <div className="relative col-span-6 flex flex-col items-center justify-center lg:col-span-2">
        <Link
          href={`/${locale}/character/${build!.character.id}`}
          className="relative flex flex-col items-center justify-center"
          prefetch={false}
        >
          <Image
            alt={build!.character.name}
            className={clsx(
              "rounded-md",
              `genshin-bg-rarity-${build!.character.rarity}`
            )}
            src={`/characters/${build!.character.id}/image.png`}
            width={100}
            height={100}
          />
          <div className="absolute -right-1 -top-1 rounded-full bg-vulcan-700 p-1">
            <ElementIcon type={build!.element} width={24} height={24} />
          </div>
        </Link>
        {isExpanded ? <p className="mt-4 text-xs">{build.note}</p> : null}
      </div>
      <div className="col-span-6 ml-5 flex w-[110px] flex-col items-start lg:col-span-2">
        <div className="build-name mb-2 text-lg text-slate-200">
          {build!.character.name}
        </div>
        <Badge className="text-slate-300">{build!.role}</Badge>
      </div>
      <div
        className={clsx("-mb-1 ml-2 grid grid-cols-2 justify-between gap-2", {
          "col-span-12 lg:col-span-8": isExpanded,
          "col-span-12 lg:col-span-4": !isExpanded,
        })}
      >
        {isExpanded ? (
          <>
            <Weapons
              weapons={build.weapons}
              messages={{
                best_weapons: messages.best_weapons,
              }}
            />
            <Artifacts
              character={build.character.id}
              artifacts={build.artifacts}
              messages={{
                best_artifacts: messages.best_artifacts,
              }}
            />
          </>
        ) : (
          <>
            <WeaponCard weapon={build.weapons[0]} />
            <ArtifactCard
              artifact={build.artifacts[0][0]}
              pcs={build.artifacts[0].length > 1 ? 2 : 1}
            />
            {build.artifacts[0].length > 1 ? (
              <ArtifactCard artifact={build.artifacts[0][1]} pcs={2} />
            ) : null}
          </>
        )}
      </div>
      {isExpanded ? (
        <>
          <div className="col-span-12 lg:col-span-4" />
          <StatsExpanded
            stats={build.stats}
            messages={{
              sands: messages.sands,
              goblet: messages.goblet,
              circlet: messages.circlet,
              main_stats: messages.main_stats,
            }}
          />
          <Substats
            substats={build.stats_priority}
            messages={{
              substats: messages.substats,
            }}
          />
        </>
      ) : (
        <div className="col-span-12 lg:col-span-4">
          <Stats
            stats={build.stats}
            messages={{
              sands: messages.sands,
              goblet: messages.goblet,
              circlet: messages.circlet,
              main_stats: messages.main_stats,
            }}
          />
        </div>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        title={
          isExpanded ? messages.hide_build_details : messages.show_build_details
        }
        className={clsx(
          "absolute right-0 top-10 flex cursor-pointer items-center justify-center rounded-lg bg-vulcan-800 bg-opacity-50 p-3 hover:bg-opacity-100 hover:text-slate-200",
          {
            "rotate-180 bg-opacity-80": isExpanded,
          }
        )}
      >
        <FaArrowDown />
      </button>
    </div>
  );
}

function Weapons({ weapons, messages }: { weapons: Weapon[]; messages: any }) {
  return (
    <div className="w-full">
      <div className="mb-1 w-full">{messages.best_weapons}</div>
      {weapons.map((weapon) => (
        <WeaponCard key={weapon.id} weapon={weapon as any} />
      ))}
    </div>
  );
}

function WeaponCard({ weapon }: { weapon: Weapon & { r: number } }) {
  return (
    <div className="relative col-span-2 mb-1 flex w-full items-center rounded-lg bg-vulcan-700">
      <div
        className={clsx(
          "flex h-[40px] w-[40px] min-w-[40px] items-center justify-center overflow-hidden rounded-lg",
          `genshin-bg-rarity-${weapon.rarity}`
        )}
      >
        <Image
          alt={weapon.name}
          className=""
          src={`/weapons/${weapon.id}.png`}
          width={40}
          height={40}
        />
      </div>
      <div className="ml-2 w-full text-sm text-slate-200">
        {weapon.name}
        {weapon.r > 1 ? (
          <span className="ml-1 rounded bg-vulcan-500 px-[4px] py-[2px] text-xs">
            R{weapon.r}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Artifacts({
  character,
  artifacts,
  messages,
}: {
  character: string;
  artifacts: Artifact[][];
  messages: any;
}) {
  return (
    <div className="flex w-full flex-wrap content-start items-center justify-between gap-1">
      <div className="w-full">{messages.best_artifacts}</div>
      <div className="grid grid-cols-2 gap-1">
        {artifacts.map((artifact, i) => (
          <Fragment key={i + character + artifact[0].id}>
            <ArtifactCard
              artifact={artifact[0]}
              pcs={artifact.length > 1 ? 2 : 1}
            />
            {artifact.length > 1 ? (
              <ArtifactCard
                key={artifact[1].id}
                artifact={artifact[1]}
                pcs={2}
              />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function ArtifactCard({ artifact, pcs }: { artifact: Artifact; pcs: number }) {
  return (
    <div
      key={artifact.id}
      className={clsx("relative flex items-center rounded-lg bg-vulcan-700", {
        "col-span-2 w-full text-sm": pcs === 1,
        "col-span-1 w-full text-xs": pcs === 2,
      })}
    >
      <div className="relative flex items-center">
        <Image
          alt={artifact.name}
          className={clsx("rounded-lg", `genshin-bg-rarity-${5}`)}
          src={`/artifacts/${artifact.id}.png`}
          width={40}
          height={40}
        />
        <div className="ml-2 text-slate-200">{artifact.name}</div>
        <div className="absolute bottom-0 left-7 rounded bg-vulcan-900/80 px-1 text-center text-xxs text-slate-300">
          {pcs === 1 ? "4" : "2"}
        </div>
      </div>
    </div>
  );
}

function Stats({ stats, messages }: { stats: any; messages: any }) {
  return (
    <div className="ml-2 flex w-full flex-col flex-wrap justify-between rounded-lg bg-vulcan-700 px-2 py-1 text-sm text-slate-300">
      <div className="flex w-full items-center">
        <b className="mr-1">{messages.sands}:</b>
        {stats.sands.join(" / ")}
      </div>
      <div className="flex w-full items-center">
        <b className="mr-1">{messages.goblet}:</b>
        {stats.goblet.join(" / ")}
      </div>
      <div className="flex w-full items-center">
        <b className="mr-1">{messages.circlet}:</b>
        {stats.circlet.join(" / ")}
      </div>
    </div>
  );
}

function StatsExpanded({ stats, messages }: { stats: any; messages: any }) {
  return (
    <div className="col-span-6 lg:col-span-4">
      <div>{messages.main_stats}</div>
      <div className="flex h-[90px] w-full flex-col flex-wrap justify-between whitespace-nowrap rounded-lg bg-vulcan-700 px-2 py-1 text-sm text-slate-300">
        <div className="flex w-full flex-wrap items-center">
          <b className="mr-1">{messages.sands}:</b>
          {stats.sands.join(" / ")}
        </div>
        <div className="flex w-full flex-wrap items-center">
          <b className="mr-1">{messages.goblet}:</b>
          {stats.goblet.join(" / ")}
        </div>
        <div className="flex w-full flex-wrap items-center">
          <b className="mr-1">{messages.circlet}:</b>
          {stats.circlet.join(" / ")}
        </div>
      </div>
    </div>
  );
}

function Substats({
  substats,
  messages,
}: {
  substats: string[];
  messages: any;
}) {
  return (
    <div className="col-span-6 ml-2 lg:col-span-4">
      <div className="mb-1 w-full">{messages.substats}</div>
      <div className="w-full rounded-lg bg-vulcan-700 px-2 py-1 text-sm">
        {substats.map((substat, i) => (
          <div
            key={substat}
            className="flex w-full items-center text-slate-300"
          >
            <b className="mr-2">{i + 1}</b>
            {substat}
          </div>
        ))}
      </div>
    </div>
  );
}
