import clsx from "clsx";
import Link from "next/link";
import dynamic from "next/dynamic";
import { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import HSRData, { type Character } from "hsr-data";

import Metadata from "@components/Metadata";
import CharacterBlock from "@components/hsr/CharacterBlock";

import { getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { localeToHSRLang } from "@utils/locale-to-lang";
import useIntl from "@hooks/use-intl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });

type Props = {
  characters: Character[];
};

function HSRIndex({ characters }: Props) {
  const [combarTypeFilterSelected, setCombarTypeFilterSelected] = useState<
    string[]
  >([]);
  const [pathTypeFilterSelected, setPathTypeFilterSelected] = useState<
    string[]
  >([]);
  const { t } = useIntl("characters");

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
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail All Characters List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage:
            "A complete list of all playable characters in Honkai: Star Rail.",
        })}
      />
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "characters",
          defaultMessage: "Characters",
        })}
      </h2>
      <p>
        {t({
          id: "characters_description",
          defaultMessage:
            "Characters are obtainable units in Honkai: Star Rail.",
        })}
      </p>
      <div className="mt-4">
        <div className="mb-4 flex flex-col bg-hsr-surface2 p-4 pt-2 md:flex-row">
          <section>
            <small className="mb-1 w-full text-xs uppercase text-slate-300">
              {t({
                id: "type",
                defaultMessage: "Type",
              })}
            </small>
            <div className="flex">
              {combatTypes.map((type) => (
                <>
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
                          combarTypeFilterSelected.filter((t) => t !== type.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={type.id}
                    className={clsx(
                      "mr-1 cursor-pointer border border-transparent p-1 hover:border-hsr-accent/50",
                      {
                        "border-hsr-accent bg-hsr-surface3":
                          combarTypeFilterSelected.includes(type.id),
                      }
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
                </>
              ))}
            </div>
          </section>
          <section>
            <small className="mb-1 w-full text-xs uppercase text-slate-300">
              {t({
                id: "element",
                defaultMessage: "Element",
              })}
            </small>
            <div className="flex">
              {pathTypes.map((type) => (
                <>
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
                          pathTypeFilterSelected.filter((t) => t !== type.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={type.id}
                    className={clsx(
                      "mr-1 cursor-pointer border border-transparent p-1 hover:border-hsr-accent/50",
                      {
                        "border-hsr-accent bg-hsr-surface3":
                          pathTypeFilterSelected.includes(type.id),
                      }
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
                </>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-3xl font-semibold uppercase leading-loose">
        <span className="text-yellow-400">SSR</span>{" "}
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <menu className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {filteredCharacters
          .filter((c) => c.rarity === 5)
          .map((character) => (
            <li key={character.id}>
              <Link href={`/hsr/character/${character.id}`}>
                <CharacterBlock character={character} />
              </Link>
            </li>
          ))}
      </menu>
      <h2 className="text-3xl font-semibold uppercase leading-loose">
        <span className="text-purple-400">SR</span>{" "}
        {t({ id: "characters", defaultMessage: "Characters" })}
      </h2>
      <menu className="grid grid-cols-3 gap-4 md:grid-cols-5">
        {filteredCharacters
          .filter((c) => c.rarity === 4)
          .map((character) => (
            <li key={character.id}>
              <Link href={`/hsr/character/${character.id}`}>
                <CharacterBlock character={character} />
              </Link>
            </li>
          ))}
      </menu>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const characters = await hsrData.characters({
    select: ["id", "name", "rarity", "combat_type", "path"],
  });

  return {
    props: {
      characters: characters.sort((a, b) => a.name.localeCompare(b.name)),
      lngDict,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
  };
};

export default HSRIndex;
