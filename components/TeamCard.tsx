import clsx from "clsx";
import Link from "next/link";
import { memo, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import CharacterPortrait from "./CharacterPortrait";
import Button from "./Button";
import Card from "./ui/Card";

import { TeamFull } from "interfaces/teams";
import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";

interface TeamCardProps {
  team: TeamFull;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const [show, setShow] = useState(false);
  const { t } = useIntl("teams");
  return (
    <Card>
      <h2 className="text-2xl font-bold text-white">
        {t({
          id: "character_team",
          defaultMessage: "Best Team for {name}",
          values: { name: team.primary[0].character.name },
        })}
      </h2>
      <div className="grid grid-cols-4">
        {team.primary.map((block, i) => (
          <div key={`${block.role}${block.character.id}${i}`}>
            <div className="text-xl">
              {t({ id: block.role.toLowerCase(), defaultMessage: block.role })}
            </div>
            <div className="flex justify-center text-center">
              <Link href={`/character/${block.character.id}`}>
                <a>
                  <LazyLoadImage
                    alt={block.character.id}
                    src={getUrl(
                      `/characters/${block.character.id}/image.png`,
                      256,
                      256
                    )}
                  />
                  <span className="text-white lg:text-2xl lg:leading-10">
                    {block.character.name}
                  </span>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button className="my-3" onClick={() => setShow(!show)}>
          {t({
            id: "substitute_characters",
            defaultMessage: "Substitute Characters",
          })}
        </Button>
      </div>
      <div
        className={clsx(
          "bg-vulcan-900 overflow-hidden",
          show ? "max-h-full" : "max-h-0"
        )}
      >
        {team.alternatives.map((alt, i) => (
          <div
            key={`sub-${team.primary[0].character.name}${i}`}
            className="flex flex-row p-2 lg:p-5 justify-between items-center border-b border-gray-700"
          >
            <div>
              {alt.characters.map((c) => (
                <CharacterPortrait key={`alt-char${c.id}${i}`} character={c} />
              ))}
            </div>
            <div className="text-4xl">→</div>
            <div className="grid grid-cols-2 justify-center items-center">
              {alt.substitutes.map((c) => (
                <CharacterPortrait key={`alt-sub${c.id}${i}`} character={c} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default memo(TeamCard);
