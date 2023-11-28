"use client";

import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import ElementIcon from "./ElementIcon";

import useIntl from "@hooks/use-intl";
import { getUrl, getUrlLQ } from "@lib/imgUrl";
import { TeamData } from "interfaces/teams";

interface TeamCardProps {
  mainName: string;
  team: TeamData;
}

const TeamCard = ({ team, mainName }: TeamCardProps) => {
  const { t } = useIntl("teams");
  return (
    <div className="card mx-2 md:mx-0">
      <h3 className="text-lg font-semibold text-white lg:text-2xl">
        {t({
          id: "character_team",
          defaultMessage: "Best Team for {name}",
          values: { name: mainName },
        })}
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {team.characters.map((block, i) => (
          <div key={`${block.role}${block.id}${i}`} className="flex flex-col">
            <div className="text-center text-xs lg:text-sm">
              {t({ id: block.role.toLowerCase(), defaultMessage: block.role })}
            </div>
            <div className="flex justify-center text-center">
              <Link href={`/character/${block.id}`} className="flex flex-col">
                <div className="group relative overflow-hidden rounded-full border-4 border-transparent transition hover:border-vulcan-500">
                  <LazyLoadImage
                    className="z-20 rounded-full object-cover transition group-hover:scale-110"
                    alt={block.id}
                    src={getUrl(`/characters/${block.id}/image.png`, 180, 180)}
                    width={165}
                    height={165}
                    placeholder={<div className="h-full w-full" />}
                    placeholderSrc={getUrlLQ(
                      `/characters/${block.id}/image.png`,
                      4,
                      4
                    )}
                  />
                  <ElementIcon
                    type={block.element}
                    height={20}
                    width={20}
                    className="absolute right-3 top-3 rounded-full bg-vulcan-700 lg:right-5 lg:top-5"
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
