"use client";

import clsx from "clsx";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";

import CharacterBlock from "@components/hsr/CharacterBlock";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import useIntl from "@hooks/use-intl";
import type { Character } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrlLQ } from "@lib/imgUrl";

type Props = {
  characters: Character[];
};

export default function CharactersList({ characters }: Props) {
  const [combarTypeFilterSelected, setCombarTypeFilterSelected] = useState<
    string[]
  >([]);
  const [pathTypeFilterSelected, setPathTypeFilterSelected] = useState<
    string[]
  >([]);
  const { t, locale } = useIntl("characters");

  const combatTypes = useMemo(() => {
    const types = characters.map((character) => character.combat_type);
    const uniqueTypes = [...new Set(types.map((type) => type.id))];
    return uniqueTypes.map((type) => {
      return {
        id: type,
        name: types.find((t) => t.id === type)?.name,
      };
    });
  }, [characters]);

  const pathTypes = useMemo(() => {
    const types = characters.map((character) => character.path);
    const uniqueTypes = [...new Set(types.map((type) => type.id))];
    return uniqueTypes.map((type) => {
      return {
        id: type,
        name: types.find((t) => t.id === type)?.name,
      };
    });
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    return characters.filter((character) => {
      return (
        (combarTypeFilterSelected.length === 0 ||
          combarTypeFilterSelected.includes(character.combat_type.id)) &&
        (pathTypeFilterSelected.length === 0 ||
          pathTypeFilterSelected.includes(character.path.id))
      );
    });
  }, [characters, combarTypeFilterSelected, pathTypeFilterSelected]);

  return (
    <div>
      <div className="mt-4">
        <div className="mb-4 flex flex-col border border-border bg-card p-4 pt-2 md:flex-row">
          <section>
            <small className="mb-1 w-full text-xs uppercase text-muted-foreground">
              {t({
                id: "type",
                defaultMessage: "Type",
              })}
            </small>
            <div className="flex">
              {combatTypes.map((type) => (
                <Fragment key={type.id}>
                  <input
                    type="checkbox"
                    name="type"
                    id={type.id}
                    className="pointer-events-none fixed appearance-none opacity-0"
                    value={type.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCombarTypeFilterSelected([
                          ...combarTypeFilterSelected,
                          type.id,
                        ]);
                      } else {
                        setCombarTypeFilterSelected(
                          combarTypeFilterSelected.filter((t) => t !== type.id),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={type.id}
                    className={clsx(
                      "mr-1 cursor-pointer border border-transparent p-1 hover:border-primary",
                      {
                        "border-accent bg-accent-foreground":
                          combarTypeFilterSelected.includes(type.id),
                      },
                    )}
                  >
                    <img
                      src={getHsrUrlLQ(`/${type.id}.webp`)}
                      alt={type.name}
                      width="60"
                      height="54"
                      className="w-[30px]"
                      loading="lazy"
                    />
                  </label>
                </Fragment>
              ))}
            </div>
          </section>
          <section>
            <small className="mb-1 w-full text-xs uppercase text-muted-foreground">
              {t({
                id: "element",
                defaultMessage: "Element",
              })}
            </small>
            <div className="flex">
              {pathTypes.map((type) => (
                <Fragment key={type.id}>
                  <input
                    type="checkbox"
                    name="type"
                    id={type.id}
                    className="pointer-events-none fixed appearance-none opacity-0"
                    value={type.id}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPathTypeFilterSelected([
                          ...pathTypeFilterSelected,
                          type.id,
                        ]);
                      } else {
                        setPathTypeFilterSelected(
                          pathTypeFilterSelected.filter((t) => t !== type.id),
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={type.id}
                    className={clsx(
                      "mr-1 cursor-pointer border border-transparent p-1 hover:border-primary",
                      {
                        "border-accent bg-accent-foreground":
                          pathTypeFilterSelected.includes(type.id),
                      },
                    )}
                  >
                    <img
                      src={getHsrUrlLQ(`/${type.id}.webp`)}
                      alt={type.name}
                      width="60"
                      height="54"
                      className="w-[30px]"
                      loading="lazy"
                    />
                  </label>
                </Fragment>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="text-3xl font-semibold uppercase leading-loose text-accent">
        <span className="text-yellow-400">SSR</span>{" "}
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <menu className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {filteredCharacters
          .filter((c) => c.rarity === 5)
          .map((character) => (
            <li key={character.id}>
              <Link
                href={`/${locale}/hsr/character/${character.id}`}
                prefetch={false}
              >
                <CharacterBlock character={character} />
              </Link>
            </li>
          ))}
      </menu>
      <h2 className="text-3xl font-semibold uppercase leading-loose text-accent">
        <span className="text-purple-400">SR</span>{" "}
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <menu className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {filteredCharacters
          .filter((c) => c.rarity === 4)
          .map((character) => (
            <li key={character.id}>
              <Link
                href={`/${locale}/hsr/character/${character.id}`}
                prefetch={false}
              >
                <CharacterBlock character={character} />
              </Link>
            </li>
          ))}
      </menu>
    </div>
  );
}
