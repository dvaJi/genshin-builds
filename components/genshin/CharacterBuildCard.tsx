import { Artifact, Weapon } from "genshin-data";
import { ReactNode, memo } from "react";

import SkillLabel from "../SkillLabel";
import ArtifactCard from "./ArtifactCard";
import ArtifactRecommendedStats from "./ArtifactRecommendedStats";
import WeaponCard from "./WeaponCard";

import useIntl from "@hooks/use-intl";
import { Build } from "interfaces/build";

type Props = {
  build: Build;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
};

const CharacterBuildCard = ({ build, weapons, artifacts }: Props) => {
  const { t: f } = useIntl("character");
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-col flex-wrap content-start max-w-sm">
        <h4 className="mb-2 text-lg font-semibold text-slate-300">
          {f({
            id: "weapons",
            defaultMessage: "Weapons",
          })}
        </h4>
        <div className="w-full">
          {build.weapons.map((weapon, i) => (
            <WeaponCard
              key={weapon.id}
              position={i + 1}
              weapon={weapons[weapon.id]}
              refinement={weapon.r}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-wrap content-start max-w-sm">
        <h4 className="mb-2 text-lg font-semibold text-slate-300">
          {f({
            id: "artifacts",
            defaultMessage: "Artifacts",
          })}
        </h4>
        {build.sets.map((set, i) => (
          <ArtifactCard
            key={`${set.join("")}`}
            position={i + 1}
            isChooseTwo={set.length > 2}
            artifacts={set
              .map((artifactId) => artifacts[artifactId])
              .filter(Boolean)}
          />
        ))}
      </div>
      <div className="flex flex-col flex-wrap content-start max-w-sm">
        <h4 className="mb-2 text-lg font-semibold text-slate-300">
          {f({
            id: "recommended_primary_stats",
            defaultMessage: "Recommended Primary Stats",
          })}
        </h4>
        <ArtifactRecommendedStats stats={build.stats} />
        <h4 className="text-lg font-semibold text-slate-300">
          {f({
            id: "substats_priority",
            defaultMessage: "Substats priority",
          })}
        </h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {build.stats_priority.map((s, i) => (
            <div key={s} className="flex rounded bg-vulcan-600 text-xs">
              <span className="rounded-l bg-vulcan-900 p-1 text-slate-400">
                {i + 1}
              </span>
              <span className="p-1 text-xs text-slate-300">{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col flex-wrap content-start max-w-sm">
        <h4 className="mb-2 text-lg font-semibold text-slate-300">
          {f({
            id: "talents_priority",
            defaultMessage: "Talents Priority",
          })}
        </h4>
        <div className="mb-2 w-full">
          {build.talent_priority
            .map<ReactNode>((talent) => (
              <span key={`tal-${talent}`} className="text-slate-300">
                <SkillLabel skill={talent.toLowerCase()} />
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
  );
};

export default memo(CharacterBuildCard);
