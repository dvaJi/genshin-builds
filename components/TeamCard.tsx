import Link from "next/link";
import { memo } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import Card from "./ui/Card";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { TeamData } from "interfaces/teams";

interface TeamCardProps {
  mainName: string;
  team: TeamData;
}

const TeamCard = ({ team, mainName }: TeamCardProps) => {
  const { t } = useIntl("teams");
  return (
    <Card>
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
            <div className="text-xs lg:text-xl text-center">
              {t({ id: block.role.toLowerCase(), defaultMessage: block.role })}
            </div>
            <div className="flex justify-center text-center">
              <Link href={`/character/${block.id}`}>
                <a>
                  <LazyLoadImage
                    className="rounded"
                    alt={block.id}
                    src={getUrl(`/characters/${block.id}/image.png`, 256, 256)}
                  />
                  <span className="text-white lg:text-2xl lg:leading-10">
                    {block.name}
                  </span>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(TeamCard);
