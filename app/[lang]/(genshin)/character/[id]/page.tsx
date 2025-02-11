import { type CharBuild } from "interfaces/build";
import { Beta } from "interfaces/genshin/beta";
import { TeamData } from "interfaces/teams";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbList, WithContext } from "schema-dts";

import { genPageMetadata } from "@app/seo";
import CharacterAscencionMaterials from "@components/genshin/CharacterAscencionMaterials";
import CharacterBuildCard from "@components/genshin/CharacterBuildCard";
import CharacterCommonBuildCard from "@components/genshin/CharacterCommonBuildCard";
import CharacterConstellationCard from "@components/genshin/CharacterConstellationCard";
import CharacterPassiveSkill from "@components/genshin/CharacterPassiveSkill";
import CharacterSkill from "@components/genshin/CharacterSkill";
import CharacterStats from "@components/genshin/CharacterStats";
import CharacterTalentMaterials from "@components/genshin/CharacterTalentMaterials";
import CharacterTeam from "@components/genshin/CharacterTeam";
import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import { i18n } from "@i18n-config";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinCharacterDetail, getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";
import { cn } from "@lib/utils";
import { localeToLang } from "@utils/locale-to-lang";
import {
  calculateTotalAscensionMaterials,
  calculateTotalTalentMaterials,
} from "@utils/totals";

interface Props {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 43200;

export async function generateStaticParams() {
  const routes: { lang: string; id: string }[] = [];

  for await (const lang of i18n.locales) {
    const _characters = (
      await getGenshinData<Character[]>({
        resource: "characters",
        language: localeToLang(lang),
        select: ["id"],
      })
    ).sort((a, b) => b.release - a.release);

    // Only the first 10 latest characters
    const characters = _characters.slice(0, 10);

    characters.forEach((character) => {
      routes.push({
        lang,
        id: character.id,
      });
    });
  }

  return routes;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const { t, langData, locale } = await getTranslations(
    lang,
    "genshin",
    "character"
  );

  const beta = await getData<Beta>("genshin", "beta");
  const _character = await getGenshinData<Character>({
    resource: "characters",
    language: langData as any,
    filter: {
      id,
    },
  });
  const _betaCharacter = beta[locale]?.characters?.find(
    (c: any) => c.id === id
  );

  const character = _character || _betaCharacter;

  if (!character) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "{name} in Genshin Impact: The Ultimate Build Guide",
    values: { name: character.name },
  });
  const description = t({
    id: "description",
    defaultMessage:
      "Enhance your Genshin Impact experience with the ultimate builds and top-performing teams for {name}. Unlock in-depth information on their skills, upgrade costs, and much more. Explore now and optimize your gameplay like never before.",
    values: { name: character.name },
  });

  return genPageMetadata({
    title,
    description,
    path: `/character/${id}`,
    image: getUrl(`/characters/${character.id}/image.png`),
    locale,
  });
}

export default async function GenshinCharacterPage({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData, locale, common } = await getTranslations(
    lang,
    "genshin",
    "character"
  );

  const detail = await getGenshinCharacterDetail(id, langData);

  const character = detail?.character;

  if (!character) {
    return notFound();
  }

  let weapons: Record<string, Weapon> = detail.weapons || {};
  let artifacts: Record<string, Artifact & { children?: Artifact[] }> =
    detail.artifacts || {};
  let builds: CharBuild[] = detail.builds || [];

  const talentsTotal = calculateTotalTalentMaterials(
    character.talent_materials
  );
  const ascensionTotal = calculateTotalAscensionMaterials(character.ascension);

  const recommendedTeams: TeamData[] = detail.teams || [];

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
          id: "characters",
          defaultMessage: "Characters",
        }),
        item: `https://genshin-builds.com/${lang}/characters`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: character.name,
        item: `https://genshin-builds.com/${lang}/character/${character.id}`,
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
      ></script>
      <div className="relative z-20 mb-4 flex items-start justify-between">
        <div className="flex items-center px-2 lg:px-0">
          <div
            className={cn(
              "relative mr-2 flex-none rounded-xl border-2 border-gray-900/80",
              `genshin-bg-rarity-${character.rarity}`
            )}
          >
            <Image
              className="h-40 w-40"
              src={`/characters/${character.id}/image.png`}
              alt={character.name}
              width={160}
              height={160}
            />
          </div>
          <div className="flex flex-grow flex-col">
            <div className="mr-2 flex items-center">
              <h1 className="mr-2 text-3xl text-white">
                {t({
                  id: "character_title",
                  defaultMessage: "Genshin Impact {name} Build",
                  values: { name: character.name },
                })}
              </h1>
              <ElementIcon
                type={common[character.element.name]}
                width={30}
                height={30}
              />
            </div>
            <div className="hidden text-gray-200 md:block">
              {character.description}
            </div>
            <div className="hidden text-gray-200 md:block">
              {character.affiliation}
            </div>
          </div>
        </div>
      </div>
      {(character as any).beta ? (
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
      {builds?.length > 0 || detail.mubuild ? (
        <h2 className="mb-3 text-3xl text-white">
          {t("builds", { name: character.name })}
        </h2>
      ) : null}
      {builds?.length > 0
        ? builds.map((build) => (
            <CharacterBuildCard
              key={build.id}
              build={build}
              artifacts={artifacts}
              weapons={weapons}
              locale={locale}
              messages={{
                title: t("build_title", {
                  name: build.role,
                }),
                weapons: t("weapons"),
                artifacts: t("artifacts"),
                choose_2: t("choose_2"),
                recommended_primary_stats: t("recommended_primary_stats"),
                substats_priority: t("substats_priority"),
                talents_priority: t("talents_priority"),
                burst: t("burst"),
                skill: t("skill"),
                normal_attack: t("normal_attack"),
                sands: t("sands"),
                goblet: t("goblet"),
                circlet: t("circlet"),
              }}
            />
          ))
        : null}
      {builds?.length > 0 || detail.mubuild ? (
        <p
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: detail.buildsNotes ?? "" }}
        />
      ) : null}

      {detail.mubuild !== null ? (
        <CharacterCommonBuildCard
          build={detail.mubuild}
          artifacts={artifacts}
          weapons={weapons}
          locale={locale}
          messages={{
            title: t("most_used_title"),
            disclaimer: t("most_used_disclaimer"),
            artifacts: t("artifacts"),
            weapons: t("weapons"),
            choose_2: t("choose_2"),
          }}
        />
      ) : null}
      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "best_team_comp",
          defaultMessage: "Best {name} Teams",
          values: { name: character.name },
        })}
      </h2>
      <div className="card mx-4 mb-4 flex flex-wrap justify-between p-0 md:mx-0">
        {recommendedTeams.map((team, index) => (
          <CharacterTeam key={team.name + index} team={team} index={index} />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_2"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="relative z-50 mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "skills",
          defaultMessage: "{name} Skills",
          values: { name: character.name },
        })}
      </h2>
      <div
        className={cn(
          "relative z-20 mb-8 grid w-full grid-cols-1 justify-center gap-4",
          character.skills.length > 3
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "lg:grid-cols-3"
        )}
      >
        {character.skills.map((skill) => (
          <CharacterSkill
            key={skill.id}
            characterId={character.id}
            skill={skill}
          />
        ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({ id: "passives", defaultMessage: "Passives" })}
      </h2>
      <div className="mb-8 grid w-full grid-cols-1 justify-center gap-4 lg:grid-cols-3">
        {character.passives.map((passive) => (
          <CharacterPassiveSkill
            key={passive.id}
            characterId={character.id}
            passive={passive}
          />
        ))}
      </div>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "constellations",
          defaultMessage: "Constellations",
        })}
      </h2>
      <div className="mb-8 grid w-full grid-cols-1 justify-center gap-4 lg:grid-cols-3">
        {character.constellations
          .filter((c) => c.level > 0)
          .map((constellation) => (
            <CharacterConstellationCard
              key={constellation.id}
              characterId={character.id}
              constellation={constellation}
            />
          ))}
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_4"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "stats",
          defaultMessage: "Stats",
        })}
      </h2>
      <div className="card mx-4 mb-8 lg:mx-0">
        {character.ascension[1].stats && (
          <CharacterStats ascensions={character.ascension} />
        )}
      </div>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "ascension_materials",
          defaultMessage: "Ascension Materials",
        })}
      </h2>
      <div className="card mx-4 mb-8 p-0 lg:mx-0">
        <CharacterAscencionMaterials
          ascension={character.ascension}
          ascensionTotal={ascensionTotal}
        />
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_5"
        classList={["flex", "justify-center"]}
      />
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t({
          id: "talent_materials",
          defaultMessage: "Talent Materials",
        })}
      </h2>
      <div className="card mx-4 p-0 lg:mx-0">
        <CharacterTalentMaterials
          talents={character.talent_materials}
          talentsTotal={talentsTotal}
        />
      </div>
    </div>
  );
}
