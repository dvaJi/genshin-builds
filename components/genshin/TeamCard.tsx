"use client";

import { TeamData } from "interfaces/teams";
import { useTranslations } from "next-intl";
import { memo } from "react";

import { Link } from "@i18n/navigation";

import ElementIcon from "./ElementIcon";
import Image from "./Image";

interface TeamCardProps {
  mainName: string;
  team: TeamData;
  asyncLoad?: boolean;
}

const TeamCard = ({ team, mainName, asyncLoad = true }: TeamCardProps) => {
  const t = useTranslations("Genshin.teams");
  return (
    <div className="card mx-2 md:mx-0">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {t("character_team", { name: mainName })}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {team.characters.map((block, i) => (
          <div key={`${block.role}${block.id}${i}`} className="flex flex-col">
            <div className="md:min-h-auto min-h-10 text-center text-xs lg:text-sm">
              {t(block.role.toLowerCase())}
            </div>
            <div className="flex justify-center text-center">
              <Link href={`/teams/${block.id}`} className="flex flex-col">
                <div className="group relative overflow-hidden rounded-full border-4 border-transparent transition hover:border-primary">
                  <Image
                    className="z-20 rounded-full object-cover transition group-hover:scale-110"
                    alt={block.id}
                    src={`/characters/${block.id}/image.png`}
                    width={165}
                    height={165}
                    loading={asyncLoad ? "lazy" : "eager"}
                  />
                  <ElementIcon
                    type={block.element}
                    height={20}
                    width={20}
                    className="absolute right-3 top-3 rounded-full bg-muted lg:right-5 lg:top-5"
                    asyncLoad={asyncLoad}
                  />
                </div>
                <span className="text-white">{block.name}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TeamCard);
