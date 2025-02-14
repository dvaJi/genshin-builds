import { MostUsedBuild } from "interfaces/build";

import type { Artifact, Weapon } from "@interfaces/genshin";

import ArtifactCard from "./ArtifactCard";
import WeaponCard from "./WeaponCard";

type Props = {
  build: MostUsedBuild;
  weapons: Record<string, Weapon>;
  artifacts: Record<string, Artifact>;
  locale: string;
  messages: {
    title: string;
    disclaimer: string;
    weapons: string;
    artifacts: string;
    choose_2: string;
  };
};

export default function CharacterCommonBuildCard({
  build,
  artifacts,
  weapons,
  locale,
  messages,
}: Props) {
  return (
    <div className="card mx-2 mb-4 p-3 sm:mx-4 sm:p-4 md:mx-0">
      <div className="mb-3 flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h3 className="text-xl font-semibold text-white">{messages.title}</h3>
        <div className="text-sm text-gray-400">{messages.disclaimer}</div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <h4 className="font-medium text-white">{messages.weapons}</h4>
          <div className="w-full">
            {build?.weapons.map((weapon, i) => (
              <WeaponCard
                key={weapon}
                position={i + 1}
                weapon={weapons[weapon]}
                locale={locale}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-white">{messages.artifacts}</h4>
          {build?.artifacts.map((set, i) => (
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
      </div>
    </div>
  );
}
