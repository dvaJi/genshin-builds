"use client";

import clsx from "clsx";
import { TeamData } from "interfaces/teams";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { BiCollapseVertical, BiExpandVertical } from "react-icons/bi";

import { Link } from "@i18n/navigation";
import { capitalize } from "@utils/capitalize";

import ElementIcon from "./ElementIcon";
import Image from "./Image";

type Props = {
  team: TeamData;
  index: number;
};

function CharacterTeam({ team, index }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Genshin.character");

  return (
    <div
      className={clsx(
        "mx-2 my-4 flex items-center rounded border-b border-r border-border border-r-transparent px-2 py-1 pb-4",
        {
          "border-r-border bg-background": isOpen,
        },
      )}
    >
      <div className="rounded bg-muted p-1 text-xxs text-slate-300">
        #{index + 1}
      </div>
      {/* <div className="hidden lg:mx-4 lg:block">Tier: {team.tier}</div> */}
      <div className="flex">
        {team.characters.map((character) => (
          <Link
            key={character.id}
            href={`/teams/${character.id}`}
            className="group flex flex-col items-center text-center lg:mr-8"
          >
            <div className="relative">
              <Image
                className="rounded-full border-4 border-transparent transition group-hover:border-primary group-hover:shadow-xl"
                src={`/characters/${character.id}/image.png`}
                alt={character.name || character.id}
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
              {t(character.role.toLowerCase())}
            </div>
            {isOpen && (
              <div className="flex">
                <div className="flex flex-col items-center justify-center">
                  {character.weapons.map((weapon, i) => (
                    <div key={weapon} className="flex items-center last:mb-0">
                      <div className="rounded bg-vulcan-600 px-[1px] text-xxs">
                        #{i + 1}
                      </div>
                      <Image
                        src={`/weapons/${weapon}.png`}
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
                      <Image
                        src={`/artifacts/${artifact}.png`}
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
          "bg-muted text-slate-100": isOpen,
          "bg-muted text-slate-300": !isOpen,
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
