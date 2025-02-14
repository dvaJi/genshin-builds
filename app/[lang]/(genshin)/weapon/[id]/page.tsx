import type { Beta } from "interfaces/genshin/beta";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuStar, LuTarget } from "react-icons/lu";
import { BreadcrumbList, WithContext } from "schema-dts";

import { Badge } from "@app/components/ui/badge";
import { genPageMetadata } from "@app/seo";
import WeaponAscensionMaterials from "@components/genshin/WeaponAscensionMaterials";
import { WeaponTypeBadge } from "@components/genshin/WeaponTypeBadge";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";
import { cn } from "@lib/utils";
import { calculateTotalWeaponAscensionMaterials } from "@utils/totals";

import WeaponStats from "./stats";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 43200;

export async function generateStaticParams() {
  return [];
}

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const { t, locale, langData } = await getTranslations(
    lang,
    "genshin",
    "weapon",
  );

  const _weapon = await getGenshinData<Weapon>({
    resource: "weapons",
    language: langData,
    filter: { id },
  });
  const beta = await getData<Beta>("genshin", "beta");
  const _betaWeapon = beta[locale]?.weapons?.find((c: any) => c.id === id);

  const weapon = _weapon || _betaWeapon;

  if (!weapon) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "{name} in Genshin Impact - Best Weapons Guide",
    values: { name: weapon.name },
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Everything you need to know about {name} in Genshin Impact. Find its stats, refinements, recommended characters, and ascension materials.",
    values: { name: weapon.name },
  });

  return genPageMetadata({
    title,
    description,
    path: `/weapon/${id}`,
    image: getUrl(`/weapons/${weapon.id}.png`),
    locale,
  });
}

export default async function GenshinWeaponPage({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData, locale } = await getTranslations(
    lang,
    "genshin",
    "weapon",
  );

  const _weapon = await getGenshinData<Weapon>({
    resource: "weapons",
    language: langData,
    filter: { id },
  });
  const beta = await getData<Beta>("genshin", "beta");
  const _betaWeapon = beta[locale]?.weapons?.find((c: any) => c.id === id);

  const weapon: (Weapon & { beta?: boolean }) | undefined =
    _weapon || _betaWeapon;

  if (!weapon) {
    return notFound();
  }

  const builds = await getGenshinData<any>({
    resource: "mostUsedBuilds",
    language: langData as any,
    asMap: true,
  });

  const recommendedCharacters = Object.entries(builds)
    .filter(([_, build]: any) => build?.weapons?.includes(weapon.id))
    .map(([character]) => character);

  const ascensionTotal = calculateTotalWeaponAscensionMaterials(
    weapon.ascensions,
  );

  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Genshin Impact",
        item: `https://genshin-builds.com/${lang}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t({
          id: "weapons",
          defaultMessage: "Weapons",
        }),
        item: `https://genshin-builds.com/${lang}/weapons`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: weapon.name,
        item: `https://genshin-builds.com/${lang}/weapon/${weapon.id}`,
      },
    ],
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="relative z-20 mb-4 flex flex-col items-start justify-between space-y-2 sm:space-y-4">
        <div className="flex w-full flex-col items-center px-2 sm:flex-row sm:items-start lg:px-0">
          <div
            className={cn(
              "relative mb-3 flex-none rounded-xl border-2 border-gray-900/80 sm:mb-0 sm:mr-4",
              `genshin-bg-rarity-${weapon.rarity}`,
            )}
          >
            <img
              className="h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40"
              src={getUrl(`/weapons/${weapon.id}.png`, 160, 160)}
              alt={weapon.name}
              width={160}
              height={160}
            />
          </div>
          <div className="flex flex-grow flex-col space-y-2 text-center sm:text-left">
            <div className="mb-2 flex flex-col items-center sm:mb-0 sm:flex-row sm:items-center">
              <h1 className="mb-2 text-2xl text-white sm:mb-0 sm:mr-2 sm:text-3xl">
                {t({
                  id: "weapon_title",
                  defaultMessage: "Genshin Impact {name}",
                  values: { name: weapon.name },
                })}
              </h1>
            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-1.5 sm:justify-start sm:gap-2">
              <WeaponTypeBadge weaponType={weapon.type} />
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <LuStar className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="truncate">{weapon.rarity}★</span>
              </Badge>
              {weapon.stats.secondary && (
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  <LuTarget className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                  <span className="truncate">{weapon.stats.secondary}</span>
                </Badge>
              )}
            </div>
            <blockquote className="mt-6 italic">
              {weapon.description}
            </blockquote>
          </div>
        </div>
      </div>

      {weapon.beta && (
        <div className="flex items-center justify-center px-4 sm:px-0">
          <div className="w-full rounded border border-red-400/50 bg-red-600/50 p-2 text-center text-white">
            Current content is a subject to change!
          </div>
        </div>
      )}

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <div className="mb-8">
        <WeaponStats weapon={weapon} />
      </div>

      {recommendedCharacters.length > 0 && (
        <>
          <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
            {t({
              id: "recommended_characters",
              defaultMessage: "Recommended Characters",
            })}
          </h2>
          <div className="card mx-4 mb-8 flex flex-wrap gap-4 p-4 lg:mx-0">
            {recommendedCharacters.map((character) => (
              <Link
                key={character}
                href={`/${lang}/character/${character}`}
                className="group relative inline-block scale-100 rounded-lg transition-all hover:scale-105"
                prefetch={false}
              >
                <div className="relative rounded-lg border-2 border-gray-900/80 bg-muted">
                  <img
                    className="h-20 w-20 rounded-lg sm:h-24 sm:w-24"
                    src={getUrl(`/characters/${character}/image.png`, 96, 96)}
                    alt={character}
                    width={96}
                    height={96}
                  />
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />

      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <div className="card mx-4 p-0 lg:mx-0">
        <WeaponAscensionMaterials
          ascension={weapon.ascensions}
          ascensionTotal={ascensionTotal}
        />
      </div>
    </div>
  );
}
