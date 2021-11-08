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
  const { t: f } = useIntl();
  return (
    <div className="">
      {/* <p>{build.name}</p> */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-wrap w-full lg:w-4/5 pr-2 content-start">
          <div className="text-xl mb-2 font-semibold">
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
        <div className="flex flex-wrap w-full lg:w-4/5 ml-2 content-start">
          <div className="text-xl mb-2 font-semibold">
            {f({
              id: "artifacts",
              defaultMessage: "Artifacts",
            })}
            :
          </div>
          {build.artifacts
            .map<ReactNode>((set) => (
              <div key={`${set[0]}-${set[1]}`}>
                {set.length === 2 ? (
                  <div className="flex flex-row w-full">
                    <ArtifactCard artifact={artifacts[set[0]]} pieces={2} />
                    <ArtifactCard artifact={artifacts[set[1]]} pieces={2} />
                  </div>
                ) : (
                  <ArtifactCard artifact={artifacts[set[0]]} pieces={4} />
                )}
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
  );
};

export default memo(CharacterCommonBuildCard);
