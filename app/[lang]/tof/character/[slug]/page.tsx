import clsx from "clsx";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import MatrixPortrait from "@components/tof/MatrixPortrait";
import TypeIcon from "@components/tof/TypeIcon";
import Image from "@components/tof/Image";
import useTranslations from "@hooks/use-translations";
import { i18n } from "@i18n-config";
import type { Characters } from "@interfaces/tof/characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Characters[]>("tof", "characters");

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: c.id,
      }))
    );
  }

  return routes;
}

interface Props {
  params: {
    slug: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const characters = await getRemoteData<Characters[]>("tof", "characters");
  const character = characters.find((c) => slugify2(c.name) === params.slug);

  if (!character) {
    return;
  }

  const title = `${character.name} - Tower of Fantasy Builds and Wiki Database`;
  const description = `${character.name} is a ${character.rarity} rarity character in Tower of Fantasy. Learn about their skills, talents, builds, and tier list.`;

  return genPageMetadata({
    title,
    description,
    path: `/tof/character/${params.slug}`,
    locale: params.lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const characters = await getRemoteData<Characters[]>("tof", "characters");
  const character = characters.find((c) => slugify2(c.name) === params.slug);

  if (!character) {
    return notFound();
  }

  // const favoritesGift = await tofData.getFavoriteGiftByCharacterId(
  //   character.id
  // );
  // const gifts = await tofData.getGiftsByCharacterId(character.id);
  // const matrices = await tofData.matrices();
  // const builds = getBuildsByCharacterId(character.id);

  return (
    <div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex w-full  flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Image
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={`/characters/${character.id}.png`}
            alt={character.name}
            width={192}
            height={192}
          />
          <div className="">
            <h2 className="text-tof-50 mb-4 text-4xl font-bold lg:text-6xl">
              {character.name}
            </h2>
            <span
              className={clsx("text-xl font-bold lg:text-3xl", {
                "text-purple-500": character.rarity === 4,
                "text-yellow-200": character.rarity === 5,
              })}
            >
              {character.rarity}
            </span>
            <span className="ml-2 text-xl uppercase lg:text-3xl">
              Simulacrum
            </span>
          </div>
        </div>
        <div className="mx-4 flex w-full flex-row-reverse items-center justify-between lg:w-auto">
          <Image
            src={`/weapons/icon_${character.weaponId}.png`}
            className="h-24 w-24 lg:h-48 lg:w-48"
            alt={character.weaponId}
            width={96}
            height={96}
          />
          <div>
            <h2 className="text-tof-50 mb-4 text-xl font-bold lg:text-4xl">
              {character.weaponId}
            </h2>
            <div className="flex justify-between">
              <div className="flex items-center">
                <TypeIcon type={character.weapon.element} className="w-8" />
                <span className="ml-1 text-lg lg:text-xl">
                  {character.weapon.element}
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
        {/* {builds.length > 0 && (
          <div className="mb-10 block">
            <h2 className="text-tof-50 text-2xl font-bold uppercase">
              {t({
                id: "recommended_matrices",
                defaultMessage: "Recommended Matrices",
              })}
            </h2>
            <div className="flex flex-wrap">
              {builds.map((build) => (
                <Link
                  key={build.id}
                  href={`/${params.lang}/tof/matrices/${build.id}`}
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
        )} */}
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-10 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Skills
          </h2>
          {character.skills.map((skill) => (
            <div key={skill.name} className="mb-6">
              <h3 className="text-tof-50 text-lg font-bold">
                {skill.name}
                {skill.type.map((type) => (
                  <span
                    key={type}
                    className="text-tof-900 ml-2 rounded bg-amber-200 px-2 py-1 text-xs"
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
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Awakening
          </h2>
          {character.traits.map((trait, index) => (
            <div key={trait.name} className="mb-4">
              <h3 className="text-tof-50 text-xl font-bold">{trait.name}</h3>
              <div className="bg-tof-900 mr-4 w-36 rounded px-2 text-yellow-100">
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
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Advancement
          </h2>
          {character.advancement.map((advancement, index) => (
            <div key={advancement} className="my-2 flex items-center py-2">
              <div className="bg-tof-900 mr-4 px-2 text-yellow-100">
                ★{index + 1}
              </div>
              <div dangerouslySetInnerHTML={{ __html: advancement }} />
            </div>
          ))}
        </div>
        <div className="mb-8 block">
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Gifts
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
          <h2 className="text-tof-50 text-2xl font-bold uppercase">
            Upgrade Cost Planner
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
                  <td className="text-tof-100 text-center text-xl">
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
                    <div className="text-tof-100 flex items-center text-lg">
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
