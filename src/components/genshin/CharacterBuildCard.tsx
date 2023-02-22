import { memo, ReactNode } from "react";
import type { Artifact, Weapon } from "genshin-data";
import type { Build } from "@/interfaces/genshin/build";

import WeaponCard from "@/components/genshin/WeaponCard";
import ArtifactRecommendedStats from "@/components/genshin/ArtifactRecommendedStats";
import ArtifactChooseCard from "@/components/genshin/ArtifactChooseCard";
import ArtifactCard from "@/components/genshin/ArtifactCard";
import SkillLabel from "@/components/genshin/SkillLabel";

type Props = {
  build: Build;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  dict: Record<string, string>;
};

const CharacterBuildCard = ({ build, weapons, artifacts, dict }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div className="flex w-full flex-wrap content-start pr-2 lg:pr-4">
        <div className="mb-2 text-xl font-semibold">{dict["weapons"]}:</div>
        <div>
          {build.weapons
            .map<ReactNode>((weapon) => (
              <WeaponCard
                key={weapon.id}
                weapon={weapons[weapon.id]}
                refinement={weapon.r}
              />
            ))
            .reduce((prev, curr, i) => [
              prev,
              <div key={`weapon_divider_${i}`} className="build-option-divider">
                {dict["or"]}
              </div>,
              curr,
            ])}
        </div>
      </div>
      <div className="flex w-full flex-wrap content-start md:ml-2">
        <div className="mb-2 w-full text-xl font-semibold">
          {dict["talents_priority"]}:
        </div>
        <div className="mb-2 w-full">
          {build.talent_priority
            .map<ReactNode>((talent) => (
              <span key={`tal-${talent}`}>
                <SkillLabel
                  skillId={talent.toLowerCase()}
                  skill={dict[talent.toLowerCase().replace(" ", "_")]}
                />
              </span>
            ))
            .reduce((prev, curr, i) => [
              prev,
              <span key={`talent_p_divider_${i}`} className="mx-3">
                {">"}
              </span>,
              curr,
            ])}
        </div>
        <div className="mb-2 text-xl font-semibold">{dict["artifacts"]}:</div>
        <div className="mb-3 w-full">
          <h2 className="font-bold">{dict["recommended_primary_stats"]}</h2>
          <ArtifactRecommendedStats stats={build.stats} dict={dict} />
          <div className="mb-2">
            <h2 className="font-bold">{dict["substats_priority"]}</h2>
            <div>{build.stats_priority.join(" / ")}</div>
          </div>
        </div>
        {build.sets
          .map<ReactNode>((set) => (
            <div className="flex w-full flex-row" key={`${set.join("")}`}>
              {set.length > 2 ? (
                <ArtifactChooseCard
                  dict={dict}
                  artifacts={
                    set
                      .map(
                        (artifactId) =>
                          artifacts[artifactId] && artifacts[artifactId]
                      )
                      .filter((a) => a !== undefined) as [
                      Artifact & { children?: Artifact[] | undefined }
                    ]
                  }
                />
              ) : (
                <ArtifactCard
                  dict={dict}
                  artifact={artifacts[set[0]]}
                  artifact2={set.length > 1 ? artifacts[set[1]] : undefined}
                />
              )}
            </div>
          ))
          .reduce((prev, curr, i) => [
            prev,
            <div key={`set_divider_${i}`} className="build-option-divider">
              {dict["or"]}
            </div>,
            curr,
          ])}
      </div>
    </div>
  );
};

export default memo(CharacterBuildCard);
