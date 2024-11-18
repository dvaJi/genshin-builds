import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/tof/Image";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { i18n } from "@i18n-config";
import type { Weapons } from "@interfaces/tof/weapons";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";
import { slugify2 } from "@utils/hash";

import Skills from "./skills";
import Stats from "./stats";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; slug: string }[] = [];

  for await (const lang of i18n.locales) {
    const data = await getRemoteData<Weapons[]>("tof", "weapons");

    routes.push(
      ...data.map((c) => ({
        lang,
        slug: slugify2(c.name),
      }))
    );
  }

  return routes;
}

interface Props {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, slug } = await params;
  const data = await getRemoteData<Weapons[]>("tof", "weapons");
  const weapon = data.find((c) => slugify2(c.name) === slug);

  if (!weapon) {
    return;
  }

  const title = `${weapon.name} - Tower of Fantasy Builds and Wiki Database`;
  const description = `${weapon.name} is a ${weapon.rarity} rarity ${weapon.element} ${weapon.category} in Tower of Fantasy. Find out the best builds, weapons, and artifacts for ${weapon.name} to clear content.`;

  return genPageMetadata({
    title,
    description,
    path: `/tof/weapons/${slug}`,
    locale: lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params;
  const weapons = await getRemoteData<Weapons[]>("tof", "weapons");
  const weapon = weapons.find((c) => slugify2(c.name) === slug);

  if (!weapon) {
    return notFound();
  }

  const weaponLevel = 200;
  const weaponStars = 6;

  // (baseValue + weaponLevel * upgradePropValue) * advancementCoefficient
  const advancementCoefficients = weapon.weaponAdvancements.reduce(
    (acc, advancement, index) => {
      // Coefficients in the current advancement (1-6)
      const currentCoefficients: Record<string, number> = {};
      advancement.multiplier.forEach(({ statId, coefficient }) => {
        currentCoefficients[statId] = coefficient;
      });

      // Add the 0-star advancement which is not in the api
      if (index === 0) {
        const zeroStarCoefficients: Record<string, number> = {};
        advancement.multiplier.forEach(({ statId }) => {
          zeroStarCoefficients[statId] = 1;
        });
        acc["0"] = zeroStarCoefficients;
      }

      acc[index + 1] = currentCoefficients;
      return acc;
    },
    {} as Record<string, Record<string, number>>
  );

  return (
    <div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="flex w-full flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Image
            className="h-36 w-36 lg:h-48 lg:w-48"
            src={`/weapons/icon_${weapon.id}.png`}
            alt={weapon.name}
            width={192}
            height={192}
          />
          <div className="">
            <h2 className="mb-4 text-2xl font-bold text-tof-50 lg:text-4xl">
              {weapon.name}
            </h2>
            <span
              className={clsx("text-xl font-bold", {
                "text-purple-500": weapon.rarity === 4,
                "text-yellow-200": weapon.rarity === 5,
              })}
            >
              {weapon.rarity === 4 ? "SR" : "SSR"}
            </span>
            <span className="ml-2 text-xl uppercase">Weapon</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex min-w-[150px] flex-col gap-2">
            <Stats label="Element" value={weapon.element} />
            <Stats label="Type" value={weapon.category} />
          </div>
          <div className="flex min-w-[100px] flex-col gap-2">
            {weapon.weaponStats.map((stat) => (
              <Stats
                key={stat.id}
                label={stat.name}
                value={Math.floor(
                  (weaponLevel * stat.upgradeProp + stat.value) *
                    (advancementCoefficients?.[weaponStars]?.[stat.id] ?? 1)
                ).toString()}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <FrstAds
          placementName="genshinbuilds_incontent_1"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            Part of a set
          </h2>
          <div className="flex rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            {weapon.simulacra ? (
              <Link
                href={`/tof/character/${slugify2(weapon.simulacra.name)}`}
                className="flex flex-col items-center rounded-lg p-4 hover:bg-tof-600"
                prefetch={false}
              >
                <Image
                  className="h-24 w-24"
                  src={`/characters/portrait_${weapon.simulacra.id}.png`}
                  alt={weapon.simulacra.name}
                  width={96}
                  height={96}
                />
                <h3 className="text-xl text-tof-50">{weapon.simulacra.name}</h3>
              </Link>
            ) : null}
            <Link
              href={`/tof/weapons/${slugify2(weapon.name)}`}
              className="flex flex-col items-center rounded-lg p-4 hover:bg-tof-600"
              prefetch={false}
            >
              <Image
                src={`/weapons/icon_${weapon.id}.png`}
                className="h-24 w-24"
                alt={weapon.name}
                width={96}
                height={96}
              />
              <h3 className="text-xl text-tof-50">{weapon.name}</h3>
            </Link>
            {weapon.matrix ? (
              <Link
                href={`/tof/matrices/${slugify2(weapon.matrix.name)}`}
                className="flex flex-col items-center rounded-lg p-4 hover:bg-tof-600"
                prefetch={false}
              >
                <Image
                  src={`/matrices/icon_${weapon.matrix.id}.png`}
                  className="h-24 w-24"
                  alt={weapon.matrix.name}
                  width={96}
                  height={96}
                />
                <h3 className="text-xl text-tof-50">{weapon.matrix.name}</h3>
              </Link>
            ) : null}
          </div>
        </div>
        <div className="mb-10 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            Weapon Effects
          </h2>
          <div className="rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            {weapon.weaponEffects.map((effect) => (
              <div key={effect.title} className="mb-4">
                <h3 className="text-xl font-bold text-tof-50">
                  {effect.title}
                </h3>
                <div
                  className="text text-tof-300"
                  dangerouslySetInnerHTML={{
                    __html: effect.description,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_2"
          classList={["flex", "justify-center"]}
        />
        <div className="mb-8 block">
          <h2 className="text-2xl font-bold uppercase text-tof-50">
            Advancements
          </h2>
          <div className="flex flex-col rounded border border-vulcan-700 bg-vulcan-700/90 px-4 py-4 shadow-lg">
            {weapon.weaponAdvancements.map((advancement, i) => (
              <div key={i + "star"} className="my-2 flex items-center py-2">
                <div className="mr-4 bg-tof-900 px-2 text-yellow-100">
                  ★{i + 1}
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: advancement.description }}
                />
              </div>
            ))}
          </div>
        </div>
        <FrstAds
          placementName="genshinbuilds_incontent_3"
          classList={["flex", "justify-center"]}
        />
        <Skills title="Normal Skills" skills={weapon.weaponAttacks.normals} />
        <Skills title="Dodge Skills" skills={weapon.weaponAttacks.dodge} />
        <Skills title="Skills" skills={weapon.weaponAttacks.skill} />
        <Skills
          title="Discharge Skills"
          skills={weapon.weaponAttacks.discharge}
        />
      </div>
    </div>
  );
}
