import { memo, useState } from "react";

import { IMGS_CDN } from "@lib/constants";
import { TeamFull } from "interfaces/teams";
import useIntl from "@hooks/use-intl";
import CharacterPortrait from "./CharacterPortrait";
import clsx from "clsx";
import Link from "next/link";

interface TeamCardProps {
  team: TeamFull;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const [show, setShow] = useState(false);
  const { t } = useIntl();
  return (
    <div className="mb-3 p-5 rounded border border-vulcan-900 bg-vulcan-800">
      <h2 className="text-2xl font-bold text-white">
        {t({
          id: "character_team",
          defaultMessage: "Best Team for {name}",
          values: { name: team.primary[0].character.name },
        })}
      </h2>
      <div className="flex justify-between">
        {team.primary.map((block, i) => (
          <div key={`${block.role}${block.character.id}${i}`}>
            <div className="text-xl">{block.role}</div>
            <div className=" text-center">
              <Link href={`/character/${block.character.id}`}>
                <a>
                  <img
                    className="rounded-lg"
                    alt={block.character.id}
                    src={`${IMGS_CDN}/characters/${block.character.id}/image.png`}
                  />
                  <span className="text-white text-2xl leading-10">
                    {block.character.name}
                  </span>
                </a>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button
          className="bg-vulcan-700 hover:bg-vulcan-600 rounded mx-2 my-3 p-2 px-4"
          onClick={() => setShow(!show)}
        >
          {t({
            id: "substitute_characters",
            defaultMessage: "Substitute Characters",
          })}
        </button>
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
    </div>
  );
};

export default memo(TeamCard);
