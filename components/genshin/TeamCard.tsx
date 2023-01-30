import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Card from "../ui/Card";

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
    <Card className="mx-2 md:mx-0">
      <h2 className="text-2xl font-bold text-white">
        {t({
          id: "character_team",
          defaultMessage: "Best Team for {name}",
          values: { name: mainName },
        })}
      </h2>
      <div className="grid grid-cols-4">
        {team.characters.map((block, i) => (
          <div key={`${block.role}${block.id}${i}`}>
            <div className="text-center text-xs lg:text-xl">
              {t({ id: block.role.toLowerCase(), defaultMessage: block.role })}
            </div>
            <div className="flex justify-center text-center">
              <Link href={`/character/${block.id}`} className="flex flex-col">
                <div className="group relative overflow-hidden rounded-full border-4 border-transparent transition hover:border-vulcan-500">
                  {/* <div className="z-10 absolute transition-all top-0 right-0 opacity-5 group-hover:opacity-95 group-hover:scale-110">
                    <LazyLoadImage
                      src={getUrl(`/elements/Hydro.png`, 256, 256)}
                      effect="blur"
                      width={256}
                      height={256}
                      className=""
                    />
                  </div> */}
                  <LazyLoadImage
                    className="z-20 rounded-full transition group-hover:scale-110"
                    alt={block.id}
                    src={getUrl(`/characters/${block.id}/image.png`, 256, 256)}
                    placeholder={<div className="w-full h-full" />}
                    placeholderSrc={getUrlLQ(
                      `/characters/${block.id}/image.png`,
                      4,
                      4
                    )}
                  />
                </div>
                <span className="text-white lg:text-2xl lg:leading-10">
                  {block.name}
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(TeamCard);
