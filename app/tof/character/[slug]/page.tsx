import clsx from "clsx";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import TOFData, { languages, type Languages } from "tof-builds";

import MatrixPortrait from "@components/tof/MatrixPortrait";
import TypeIcon from "@components/tof/TypeIcon";

import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getTofUrl } from "@lib/imgUrl";
import { getDefaultLocale } from "@lib/localData";
import { getBuildsByCharacterId } from "@lib/tofdata";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations("tof", "characters");
  const tofLanguage = getDefaultLocale<Languages>(
    locale,
    languages as unknown as string[]
  );
  const tofData = new TOFData({
    language: tofLanguage,
  });
  const characters = await tofData.characters();
  const character = characters.find((c) => c.id === params.slug);

  if (!character) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "{name} ToF Impact Build Guide",
    values: { name: character.name },
  });
  const description = character.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      locale,
      type: "article",
      url: `https://genshin-builds.com/tof/character/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CharacterPage({ params }: Props) {
  const { t, locale } = await useTranslations("tof", "character");
  const tofLanguage = getDefaultLocale<Languages>(
    locale,
    languages as unknown as string[]
  );
  const tofData = new TOFData({
    language: tofLanguage,
  });
  const characters = await tofData.characters();
  const character = characters.find((c) => c.id === params.slug);

  if (!character) {
    return notFound();
  }

  // const favoritesGift = await tofData.getFavoriteGiftByCharacterId(
  //   character.id
  // );
  const gifts = await tofData.getGiftsByCharacterId(character.id);
  // const matrices = await tofData.matrices();
  const builds = getBuildsByCharacterId(character.id);

  return (
    <div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex w-full  flex-wrap items-center justify-between">
        <div className="flex items-center">
          <img
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={getTofUrl(`/characters/${character.id}.png`)}
            alt={character.name}
          />
          <div className="">
            <h2 className="mb-4 text-4xl font-bold text-tof-50 lg:text-6xl">
              {character.name}
            </h2>
            <span
              className={clsx("text-xl font-bold lg:text-3xl", {
                "text-purple-500": character.rarity === "SR",
                "text-yellow-200": character.rarity === "SSR",
              })}
            >
              {character.rarity}
            </span>
            <span className="ml-2 text-xl uppercase lg:text-3xl">
              {t({ id: "simulacrum", defaultMessage: "Simulacrum" })}
            </span>
          </div>
        </div>
        <div className="mx-4 flex w-full flex-row-reverse items-center justify-between lg:w-auto">
          <img
            src={getTofUrl(`/weapons/${character.weapon_id}.png`)}
            className="h-24 w-24 lg:h-48 lg:w-48"
            alt={character.weapon}
          />
          <div>
            <h2 className="mb-4 text-xl font-bold text-tof-50 lg:text-4xl">
              {character.weapon}
            </h2>
            <div className="flex justify-between">
              <div className="flex items-center">
                <TypeIcon type={character.element} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.element}
                </span>
              </div>
              <div className="flex items-center">
                <TypeIcon type={character.resonance} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.resonance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
        {builds.length > 0 && (
          <div className="mb-10 block">
            <h2 className="text-2xl font-bold uppercase text-tof-50">
              {t({
                id: "recommended_matrices",
                defaultMessage: "Recommended Matrices",
              })}
            </h2>
            <div className="flex flex-wrap">
              {builds.map((build) => (
                <Link
                  key={build.id}
                  href={`/tof/matrices/${build.id}`}
                  className="relative flex"
                >
                  <div className="absolute top-4 w-full text-center text-sm">
                    <span className="rounded bg-vulcan-600 px-2 py-1">
                      {t({
                        id: "pieces",
                        defaultMessage: "Pieces",
                      })}
                      : {build.pieces}
                    </span>
                  </div>
                  <MatrixPortrait matrix={build as any} />
                </Link>
              ))}
            </div>
          </div>
        )}
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "skills",
              defaultMessage: "Skills",
            })}
          </h2>
          {character.skills.map((skill) => (
            <div key={skill.name} className="mb-6">
              <h3 className="text-lg font-bold text-tof-50">
                {skill.name}
                {skill.type.map((type) => (
                  <span
                    key={type}
                    className="ml-2 rounded bg-amber-200 px-2 py-1 text-xs text-tof-900"
                  >
                    {t({ id: type.toLowerCase(), defaultMessage: type })}
                  </span>
                ))}
              </h3>
              <p
                className="text text-tof-300"
                dangerouslySetInnerHTML={{ __html: skill.description }}
              />
            </div>
          ))}
        </div>
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "awakening",
              defaultMessage: "Awakening",
            })}
          </h2>
          {character.traits.map((trait, index) => (
            <div key={trait.name} className="mb-4">
              <h3 className="text-xl font-bold text-tof-50">{trait.name}</h3>
              <div className="mr-4 w-36 rounded bg-tof-900 px-2 text-yellow-100">
                {index === 0 ? "1200 Awakening" : "4000 Awakening"}
              </div>
              <p
                className="text text-tof-300"
                dangerouslySetInnerHTML={{ __html: trait.description }}
              />
            </div>
          ))}
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "advancement",
              defaultMessage: "Advancement",
            })}
          </h2>
          {character.advancement.map((advancement, index) => (
            <div key={advancement} className="my-2 flex items-center py-2">
              <div className="mr-4 bg-tof-900 px-2 text-yellow-100">
                ★{index + 1}
              </div>
              <div dangerouslySetInnerHTML={{ __html: advancement }} />
            </div>
          ))}
        </div>
        <div className="mb-8 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "gifts",
              defaultMessage: "Gifts",
            })}
          </h2>
          <div className="flex flex-wrap">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className={clsx("m-1 rounded shadow", `TOF-bg-${gift.rarity}`)}
              >
                <img
                  className="h-16 w-16 lg:h-24 lg:w-24"
                  src={getTofUrl(`/gifts/${gift.id}.png`)}
                  title={gift.name}
                  alt={gift.name}
                />
              </div>
            ))}
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
        <div>
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            {t({
              id: "upgrade_cost_planner",
              defaultMessage: "Upgrade Cost Planner",
            })}
          </h2>
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-700 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  {t({
                    id: "level",
                    defaultMessage: "Level",
                  })}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t({
                    id: "materials",
                    defaultMessage: "Materials",
                  })}
                </th>
                <th scope="col" className="px-6 py-3">
                  {t({
                    id: "cost",
                    defaultMessage: "Cost",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {character.ascension.map((ascension) => (
                <tr
                  key={`asc-${ascension.ascension}-${ascension.level}-${ascension.cost}`}
                  className="border-b border-gray-700 bg-gray-800"
                >
                  <td className="text-center text-xl text-tof-100">
                    {ascension.level}
                  </td>
                  <td className="flex">
                    <div className="relative">
                      <div
                        className={clsx(
                          "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                          `TOF-bg-${ascension.mat1.rarity}`
                        )}
                      >
                        <img
                          src={getTofUrl(`/items/${ascension.mat1.id}.png`)}
                          alt={ascension.mat1.name}
                          title={ascension.mat1.name}
                        />
                      </div>
                      <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                        x{ascension.mat1.amount}
                      </h4>
                    </div>

                    {ascension.mat2 && (
                      <div className="relative">
                        <div
                          className={clsx(
                            "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                            `TOF-bg-${ascension.mat2.rarity}`
                          )}
                        >
                          <img
                            src={getTofUrl(`/items/${ascension.mat2.id}.png`)}
                            alt={ascension.mat2.name}
                            title={ascension.mat2.name}
                          />
                        </div>
                        <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                          x{ascension.mat2.amount}
                        </h4>
                      </div>
                    )}
                    {ascension.mat3 && (
                      <div className="relative">
                        <div
                          className={clsx(
                            "mr-2 flex w-12 items-center justify-center rounded lg:w-16",
                            `TOF-bg-${ascension.mat3.rarity}`
                          )}
                        >
                          <img
                            src={getTofUrl(`/items/${ascension.mat3.id}.png`)}
                            alt={ascension.mat3.name}
                            title={ascension.mat3.name}
                          />
                        </div>
                        <h4 className="absolute -bottom-px right-4 z-30 font-bold text-white shadow-black drop-shadow-lg">
                          x{ascension.mat3.amount}
                        </h4>
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center text-lg text-tof-100">
                      <img
                        src={getTofUrl(`/icons/icon_gold_64.png`)}
                        alt="Gold"
                        className="w-12 lg:w-16"
                      />
                      {ascension.cost}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
