"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

import SimpleRarityBox from "@components/SimpleRarityBox";
import Button from "@components/ui/Button";
import useIntl from "@hooks/use-intl";
import type { Character, Domains, Weapon } from "@interfaces/genshin";
import { trackClick } from "@lib/gtag";
import { getUrl } from "@lib/imgUrl";

type Props = {
  days: string[];
  domains: Domains;
  characters: Record<string, Character>;
  weapons: Record<string, Weapon>;
};

export default function FarmableToday({
  days,
  domains,
  characters,
  weapons,
}: Props) {
  const { t, locale } = useIntl("ascension_planner");
  const [currentDay, setCurrentDay] = useState(days[new Date().getDay()]);

  return (
    <>
      <div className="mb-2 flex flex-wrap justify-center">
        {days.map((day) => (
          <Button
            key={day}
            className={clsx("mx-2 my-1 rounded p-2 px-4", {
              "bg-vulcan-700": currentDay === day,
              "text-white": currentDay === day,
              "bg-vulcan-800": currentDay !== day,
            })}
            onClick={() => {
              trackClick(`planner_day`);
              setCurrentDay(day);
            }}
          >
            {day}
          </Button>
        ))}
      </div>
      <h2 className="text-2xl font-semibold text-gray-200">
        {t({
          id: "farmable_today",
          defaultMessage: "Farmable today",
        })}
      </h2>
      <div className="card flex flex-col">
        <table>
          <tbody>
            {domains.characters.map((charactersDomain) => (
              <tr key={charactersDomain.domainName}>
                <td className="w-18 border-b border-gray-700 py-2 pr-2 align-middle">
                  <h3 className="text-lg text-gray-200 ">
                    {charactersDomain.domainName}
                  </h3>
                </td>
                <td className="border-b border-gray-700 pt-2 align-middle">
                  <div className="flex flex-wrap">
                    {charactersDomain.rotation
                      .find((r) => r.day === currentDay)
                      ?.ids.map((cId) => (
                        <Link key={cId} href={`/${locale}/character/${cId}`}>
                          <SimpleRarityBox
                            img={getUrl(
                              `/characters/${cId}/${cId}_portrait.png`,
                              80,
                              80
                            )}
                            rarity={characters[cId].rarity}
                            alt={characters[cId].name}
                            className="h-16 w-16"
                          />
                        </Link>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
            {domains.weapons.map((weaponsDomain) => (
              <tr
                key={weaponsDomain.domainName}
                className="border-b border-gray-700 pt-2 align-middle"
              >
                <td className="w-18 border-b border-gray-700 py-2 pr-2 align-middle">
                  <h3 className="text-lg text-gray-200 ">
                    {weaponsDomain.domainName}
                  </h3>
                </td>
                <td className="border-b border-gray-700 pt-2 align-middle">
                  <div className="flex flex-wrap">
                    {weaponsDomain.rotation
                      .find((r) => r.day === currentDay)
                      ?.ids.map((cId) => (
                        <div key={cId}>
                          {weapons[cId] ? (
                            <Link key={cId} href={`/${locale}/weapon/${cId}`}>
                              <SimpleRarityBox
                                img={getUrl(`/weapons/${cId}.png`, 80, 80)}
                                rarity={weapons[cId].rarity}
                                alt={weapons[cId].name}
                                className="h-16 w-16"
                              />
                            </Link>
                          ) : (
                            `NOT FOUND ${cId}`
                          )}
                        </div>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
