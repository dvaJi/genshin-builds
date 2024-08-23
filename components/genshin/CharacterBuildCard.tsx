import type { CharBuild } from "interfaces/build";
import { ReactNode } from "react";

import type { Artifact, Weapon } from "@interfaces/genshin";

import SkillLabel from "../SkillLabel";
import ArtifactCard from "./ArtifactCard";
import ArtifactRecommendedStats from "./ArtifactRecommendedStats";
import WeaponCard from "./WeaponCard";

type Props = {
  build: CharBuild;
  locale: string;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  messages: {
    title: string;
    weapons: string;
    artifacts: string;
    choose_2: string;
    recommended_primary_stats: string;
    substats_priority: string;
    talents_priority: string;
    normal_attack: string;
    skill: string;
    burst: string;
    sands: string;
    goblet: string;
    circlet: string;
  };
};

const CharacterBuildCard = ({
  build,
  weapons,
  locale,
  artifacts,
  messages,
}: Props) => {
  return (
    <div className="card mx-4 mb-4 md:mx-0">
      <h3 className="mb-4 text-xl font-semibold text-slate-200">
        {messages.title}
      </h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex max-w-sm flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.weapons}
          </h4>
          <div className="w-full">
            {build.weapons.map((weapon, i) => (
              <WeaponCard
                key={weapon.id + weapon.r}
                position={i + 1}
                weapon={weapons[weapon.id]}
                refinement={weapon.r}
                locale={locale}
              />
            ))}
          </div>
        </div>
        <div className="flex max-w-sm flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.artifacts}
          </h4>
          {build.sets.map((set, i) => (
            <ArtifactCard
              key={`${set.join("")}`}
              position={i + 1}
              isChooseTwo={set.length > 2}
              artifacts={set
                .map((artifactId) => artifacts[artifactId])
                .filter(Boolean)}
              messages={{
                choose_2: messages.choose_2,
              }}
            />
          ))}
        </div>
        <div className="flex max-w-sm flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.recommended_primary_stats}
          </h4>
          <ArtifactRecommendedStats
            stats={build.stats}
            messages={{
              circlet: messages.circlet,
              goblet: messages.goblet,
              sands: messages.sands,
            }}
          />
          <h4 className="text-lg font-semibold text-slate-300">
            {messages.substats_priority}
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {build.stats_priority.map((s, i) => (
              <div
                key={s}
                className="flex rounded border border-vulcan-500/30 bg-vulcan-700"
              >
                <span className="rounded-l p-1 text-xxs text-slate-300">
                  {i + 1}
                </span>
                <span className="bg-vulcan-900 p-1 text-xs text-slate-200">
                  {s}
                </span>
              </div>
            ))}
          </div>
          {build.build_notes && <p className="mt-4">{build.build_notes}</p>}
        </div>
        <div className="flex max-w-sm flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.talents_priority}
          </h4>
          <div className="mb-2 w-full">
            {build.talent_priority
              .map<ReactNode>((talent) => (
                <span key={`tal-${talent}`} className="text-slate-300">
                  <SkillLabel
                    skill={talent.toLowerCase()}
                    messages={{
                      normal_attack: messages.normal_attack,
                      skill: messages.skill,
                      burst: messages.burst,
                    }}
                  />
                </span>
              ))
              .reduce((prev, curr, i) => [
                prev,
                <span
                  key={`talent_p_divider_${i}`}
                  className="mx-3 font-bold text-slate-100"
                >
                  {">"}
                </span>,
                curr,
              ])}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterBuildCard;
