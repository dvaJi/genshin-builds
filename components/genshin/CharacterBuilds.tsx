"use client";

import clsx from "clsx";
import type { Artifact, Weapon } from "genshin-data";
import { useState } from "react";

import StarRarity from "@components/StarRarity";
import CharacterBuildCard from "./CharacterBuildCard";
import CharacterCommonBuildCard from "./CharacterCommonBuildCard";

import useIntl from "@hooks/use-intl";
import type { Build, MostUsedBuild } from "interfaces/build";

type Props = {
  characterName: string;
  builds: Build[];
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact & { children?: Artifact[] }>;
  mubuild: MostUsedBuild;
  officialbuild?: MostUsedBuild;
};

function CharacterBuilds({
  characterName,
  builds,
  artifacts,
  mubuild,
  weapons,
  officialbuild,
}: Props) {
  const [buildSelected, setBuildSelected] = useState(
    builds.findIndex((b) => b.recommended) ?? 0
  );

  const { t } = useIntl("character");

  const buttonClasses = (selected: boolean) =>
    clsx(
      "mr-2 rounded border py-1 px-3 hover:border-vulcan-600/90 md:text-lg",
      {
        "border-vulcan-500/50 bg-vulcan-600 text-white": selected,
        "border-vulcan-600/50 bg-vulcan-700/80": !selected,
      }
    );

  return (
    <>
      <h2 className="mb-3 text-3xl text-white">
        {t({
          id: "builds",
          defaultMessage: "Best {name} Builds",
          values: { name: characterName },
        })}
      </h2>

      <div className="card mb-6">
        <div className="mb-2">
          {mubuild && (
            <button
              className={buttonClasses(buildSelected === -1)}
              onClick={() => setBuildSelected(-1)}
            >
              <div className="inline-block w-5">
                <StarRarity rarity={1} />
              </div>
              {t({ id: "most_used", defaultMessage: "Most Used" })}
            </button>
          )}
          {officialbuild && (
            <button
              className={buttonClasses(buildSelected === -2)}
              onClick={() => setBuildSelected(-2)}
            >
              <div className="inline-block w-5">
                <StarRarity rarity={1} />
              </div>
              {t({ id: "official_build", defaultMessage: "Official Build" })}
            </button>
          )}
          {builds.map((build, index) => (
            <button
              key={build.id}
              className={buttonClasses(buildSelected === index)}
              onClick={() => setBuildSelected(index)}
            >
              {build.recommended && (
                <div className="inline-block w-5">
                  <StarRarity rarity={1} />
                </div>
              )}
              {build.name}
            </button>
          ))}
        </div>
        {buildSelected < 0 ? (
          <CharacterCommonBuildCard
            build={buildSelected === -1 ? mubuild : officialbuild!}
            artifacts={artifacts}
            weapons={weapons}
          />
        ) : (
          <CharacterBuildCard
            build={builds[buildSelected]}
            artifacts={artifacts}
            weapons={weapons}
          />
        )}
      </div>
    </>
  );
}

export default CharacterBuilds;
