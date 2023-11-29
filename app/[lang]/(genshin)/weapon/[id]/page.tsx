import GenshinData, { type Weapon } from "genshin-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import WeaponStats from "./stats";

import WeaponAscensionMaterials from "@components/genshin/WeaponAscensionMaterials";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getUrl } from "@lib/imgUrl";
import { getCharacterMostUsedBuild, getData } from "@lib/localData";
import { Beta } from "interfaces/genshin/beta";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  params: {
    id: string;
    lang: string;
  };
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, langData, locale } = await useTranslations(
    params.lang,
    "genshin",
    "weapon"
  );

  const genshinData = new GenshinData({ language: langData as any });
  const weapons = await genshinData.weapons();
  const beta = await getData<Beta>("genshin", "beta");
  const _weapon = weapons.find((c) => c.id === params.id);
  const _betaCharacter = beta[locale].weapons.find(
    (c: any) => c.id === params.id
  );

  const weapon = _weapon || _betaCharacter;

  if (!weapon) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "{name} Genshin Impact Weapon Details",
    values: { name: weapon.name },
  });
  const description = weapon.description;

  return genPageMetadata({
    title,
    description,
    path: `/weapon/${params.id}`,
    image: getUrl(`/weapons/${weapon.id}.png`),
    locale,
  });
}

export default async function GenshinWeaponPage({ params }: Props) {
  const { t, langData, locale } = await useTranslations(
    params.lang,
    "genshin",
    "weapon"
  );
  const genshinData = new GenshinData({ language: langData as any });
  const weapons = await genshinData.weapons();
  const _weapon = weapons.find((c) => c.id === params.id);
  const beta = await getData<Beta>("genshin", "beta");
  const _betaWeapon = beta[locale].weapons.find((c: any) => c.id === params.id);

  const weapon:
    | (Weapon & {
        beta?: boolean | undefined;
      })
    | undefined = _weapon || _betaWeapon;

  if (!weapon) {
    return notFound();
  }

  const builds = await getCharacterMostUsedBuild();
  const recommendedCharacters = Object.values(builds)
    .filter((build: any) => build.weapons.includes(weapon.id))
    .map((build: any) => build.character);

  return (
    <div className="relative">
      {weapon.beta ? (
        <div className="flex items-center justify-center">
          <div className="rounded border border-red-400/50 bg-red-600/50 p-1 text-center text-white">
            Current content is a subject to change!
          </div>
        </div>
      ) : null}
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mb-4 flex items-start justify-between">
        <div className="relative flex flex-wrap items-center px-2 lg:flex-nowrap lg:px-0">
          <div
            className="relative mr-2 flex-none rounded-lg border border-gray-900 bg-cover lg:mr-5"
            style={{
              backgroundImage: `url(${getUrl(`/bg_${weapon.rarity}star.png`)})`,
            }}
          >
            <img
              className="h-52 w-52"
              src={getUrl(`/weapons/${weapon.id}.png`, 236, 236)}
              alt={weapon.name}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white">
                {weapon.name} ({weapon.rarity}★)
              </h1>
            </div>
            <ul>
              <li>
                {t({ id: "type", defaultMessage: "Type" })}: {weapon.type}
              </li>
              <li>
                {t({ id: "secondary", defaultMessage: "Secondary" })}:{" "}
                {weapon.stats.secondary || "N/A"}
              </li>
            </ul>
            <div>{weapon.description}</div>
          </div>
        </div>
      </div>
      <WeaponStats weapon={weapon} />
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      {recommendedCharacters.length > 0 && (
        <>
          <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
            {t({
              id: "recommended_characters",
              defaultMessage: "Recomended Characters",
            })}
          </h2>
          <div className="mx-4 mb-4 flex lg:mx-0">
            {recommendedCharacters.map((character) => (
              <Link
                key={character}
                href={`/${params.lang}/character/${character}`}
                className="group mr-10 rounded-full border-4 border-transparent transition hover:border-vulcan-500"
              >
                <img
                  className="rounded-full group-hover:shadow-xl"
                  src={getUrl(
                    `/characters/${character}/${character}_portrait.png`,
                    126,
                    126
                  )}
                  alt={character}
                  width="100"
                  height="100"
                />
              </Link>
            ))}
          </div>
        </>
      )}
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <div className="card mx-4 p-0 lg:mx-0">
        <WeaponAscensionMaterials ascension={weapon.ascensions} />
      </div>
    </div>
  );
}
