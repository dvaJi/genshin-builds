import type { Artifact, Weapon } from "genshin-data";
import { memo } from "react";

import ArtifactCard from "./ArtifactCard";
import WeaponCard from "./WeaponCard";

import useIntl from "@hooks/use-intl";
import { MostUsedBuild } from "interfaces/build";

type Props = {
  build: MostUsedBuild;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
};

const CharacterCommonBuildCard = ({ build, weapons, artifacts }: Props) => {
  const { t: f } = useIntl("character");
  return (
    <div className="">
      {/* <p>{build.name}</p> */}
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {f({
              id: "weapons",
              defaultMessage: "Weapons",
            })}
          </h4>
          <div className="w-full">
            {build.weapons.map((weapon, i) => (
              <WeaponCard
                key={weapon}
                position={i + 1}
                weapon={weapons[weapon]}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {f({
              id: "artifacts",
              defaultMessage: "Artifacts",
            })}
          </h4>
          {build.artifacts.map((set, i) => (
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
      </div>
    </div>
  );
};

export default memo(CharacterCommonBuildCard);
