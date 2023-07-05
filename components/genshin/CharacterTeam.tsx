import Link from "next/link";
import { BiCollapseVertical, BiExpandVertical } from "react-icons/bi";

import useIntl from "@hooks/use-intl";
import { getUrl } from "@lib/imgUrl";
import { capitalize } from "@utils/capitalize";
import clsx from "clsx";
import { TeamData } from "interfaces/teams";
import { memo, useState } from "react";
import ElementIcon from "./ElementIcon";

type Props = {
  team: TeamData;
  index: number;
};

function CharacterTeam({ team, index }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useIntl("character");

  return (
    <div
      className={clsx(
        "mx-2 mb-4 flex items-center rounded border-b border-r border-vulcan-600 border-r-transparent px-2 py-1 pb-4",
        {
          "border-r-vulcan-600 bg-vulcan-900": isOpen,
        }
      )}
    >
      <div className="rounded bg-vulcan-500 p-1 text-xxs text-slate-300">
        #{index + 1}
      </div>
      {/* <div className="hidden lg:mx-4 lg:block">Tier: {team.tier}</div> */}
      <div className="flex">
        {team.characters.map((character) => (
          <Link
            key={character.id}
            href={`/character/${character.id}`}
            className="group flex flex-col items-center text-center lg:mr-8"
          >
            <div className="relative">
              <img
                className="rounded-full border-4 border-transparent transition group-hover:border-vulcan-500 group-hover:shadow-xl"
                src={getUrl(
                  `/characters/${character.id}/${character.id}_portrait.png`,
                  100,
                  100
                )}
                alt={character.name}
                width={100}
                height={100}
              />
              {character.c_min > 0 && (
                <div className="absolute bottom-2 left-0 rounded-full bg-vulcan-700 p-1 text-xxs font-bold text-gray-300 md:text-xs">
                  {`C${character.c_min}`}
                </div>
              )}
              <ElementIcon
                type={capitalize(character.element)}
                height={20}
                width={20}
                className="absolute bottom-2 right-2 rounded-full bg-vulcan-700"
              />
            </div>
            <div className="h-8 text-xs lg:text-sm">
              {t({
                id: character.role.toLowerCase(),
                defaultMessage: character.role,
              })}
            </div>
            {isOpen && (
              <div className="flex">
                <div className="flex flex-col items-center justify-center">
                  {character.weapons.map((weapon, i) => (
                    <div key={weapon} className="flex items-center last:mb-0">
                      <div className="rounded bg-vulcan-600 px-[1px] text-xxs">
                        #{i + 1}
                      </div>
                      <img
                        src={getUrl(`/weapons/${weapon}.png`)}
                        alt={weapon}
                        width={36}
                        height={36}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                  {character.artifacts.map((artifact) => (
                    <div key={artifact}>
                      <img
                        src={getUrl(`/artifacts/${artifact}.png`)}
                        alt={artifact}
                        width={36}
                        height={36}
                      />
                      <span className="rounded bg-vulcan-600 px-[1px] text-xxs">
                        {character.artifacts.length === 1 ? 4 : 2} PC
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
      <button
        className={clsx("rounded p-1", {
          "bg-vulcan-300 text-slate-100": isOpen,
          "bg-vulcan-600 text-slate-300": !isOpen,
        })}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <BiCollapseVertical /> : <BiExpandVertical />}
      </button>
    </div>
  );
}

export default memo(CharacterTeam);
