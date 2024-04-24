import { MostUsedBuild } from "interfaces/build";
import Link from "next/link";

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

const CharacterCommonBuildCard = ({
  build,
  weapons,
  artifacts,
  locale,
  messages,
}: Props) => {
  return (
    <div className="card mx-4 mb-4 md:mx-0">
      <h3 className="mb-4 text-xl font-semibold text-slate-200">
        {messages.title}
      </h3>
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.weapons}
          </h4>
          <div className="w-full">
            {build.weapons.map((weapon, i) => (
              <WeaponCard
                key={weapon}
                position={i + 1}
                weapon={weapons[weapon]}
                locale={locale}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col flex-wrap content-start">
          <h4 className="mb-2 text-lg font-semibold text-slate-300">
            {messages.artifacts}
          </h4>
          {build.artifacts.map((set, i) => (
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
      <Link href={`/${locale}/profile`} className="hover:text-slate-100">
        <i>{messages.disclaimer}</i>
      </Link>
    </div>
  );
};

export default CharacterCommonBuildCard;
