import { memo, ReactNode } from "react";
import { Artifact, Weapon } from "genshin-data";

import WeaponCard from "./WeaponCard";
import ArtifactCard from "./ArtifactCard";

import { MostUsedBuild } from "interfaces/build";
import useIntl from "@hooks/use-intl";

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
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex w-full flex-wrap content-start pr-2 lg:pr-4">
          <div className="mb-2 text-xl font-semibold">
            {f({
              id: "weapons",
              defaultMessage: "Weapons",
            })}
            :
          </div>
          <div>
            {build.weapons
              .map<ReactNode>((weapon) => (
                <WeaponCard key={weapon} weapon={weapons[weapon]} />
              ))
              .reduce((prev, curr, i) => [
                prev,
                <div
                  key={`weapon_divider_${i}`}
                  className="build-option-divider"
                >
                  {f({
                    id: "or",
                    defaultMessage: "Or",
                  })}
                </div>,
                curr,
              ])}
          </div>
        </div>
        <div className="flex w-full flex-wrap content-start md:ml-2">
          <div className="mb-2 w-full text-xl font-semibold">
            {f({
              id: "artifacts",
              defaultMessage: "Artifacts",
            })}
            :
          </div>
          <div className="mb-2 w-full">
            {build.artifacts
              .map<ReactNode>((set) => (
                <div
                  key={`${set[0]}-${set[1]}`}
                  className="flex w-full flex-row"
                >
                  <ArtifactCard
                    artifact={artifacts[set[0]]}
                    artifact2={set.length === 2 ? artifacts[set[1]] : undefined}
                  />
                </div>
              ))
              .reduce((prev, curr, i) => [
                prev,
                <div key={`set_divider_${i}`} className="build-option-divider">
                  {f({
                    id: "or",
                    defaultMessage: "Or",
                  })}
                </div>,
                curr,
              ])}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CharacterCommonBuildCard);
