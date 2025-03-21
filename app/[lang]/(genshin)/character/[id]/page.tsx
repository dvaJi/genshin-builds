import { type CharBuild } from "interfaces/build";
import { Beta } from "interfaces/genshin/beta";
import { TeamData } from "interfaces/teams";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaBirthdayCake, FaMapMarkedAlt, FaUserFriends } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { BreadcrumbList, WithContext } from "schema-dts";

import { Badge } from "@app/components/ui/badge";
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
import { ElementBadge } from "@components/genshin/ElementBadge";
import ElementIcon from "@components/genshin/ElementIcon";
import Image from "@components/genshin/Image";
import { WeaponTypeBadge } from "@components/genshin/WeaponTypeBadge";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import type { Artifact, Character, Weapon } from "@interfaces/genshin";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getGenshinCharacterDetail, getGenshinData } from "@lib/dataApi";
import { getUrl } from "@lib/imgUrl";
import { getData } from "@lib/localData";
import { cn } from "@lib/utils";
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
  return [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "Genshin.character",
  });
  const langData = getLangData(lang, "genshin");

  const beta = await getData<Beta>("genshin", "beta");
  const _character = await getGenshinData<Character>({
    resource: "characters",
    language: langData as any,
    filter: {
      id,
    },
  });
  const _betaCharacter = beta[lang]?.characters?.find((c: any) => c.id === id);

  const character = _character || _betaCharacter;

  if (!character) {
    return;
  }

  const title = t("title", { name: character.name });
  const description = t("description", { name: character.name });

  return genPageMetadata({
    title,
    description,
    path: `/character/${id}`,
    image: getUrl(`/characters/${character.id}/image.png`),
    locale: lang,
  });
}

export default async function GenshinCharacterPage({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("Genshin.character");
  const langData = getLangData(lang, "genshin");

  const detail = await getGenshinCharacterDetail(id, langData);

  const character = detail?.character;

  if (!character) {
    return notFound();
  }

  const _common = await getData<Record<string, Record<string, string>>>(
    "genshin",
    "common",
  );
  const common = _common[lang] || _common["en"];
  let weapons: Record<string, Weapon> = detail.weapons || {};
  let artifacts: Record<string, Artifact & { children?: Artifact[] }> =
    detail.artifacts || {};
  let builds: CharBuild[] = detail.builds || [];

  const talentsTotal = calculateTotalTalentMaterials(
    character.talent_materials,
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
        name: t("characters"),
        item: `https://genshin-builds.com/${lang}/characters`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: t("character_title", {
          name: character.name,
        }),
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
      <div className="relative z-20 mb-4 flex flex-col items-start justify-between space-y-2 sm:space-y-4">
        <div className="flex w-full flex-col items-center px-2 sm:flex-row sm:items-start lg:px-0">
          <div
            className={cn(
              "relative mb-3 flex-none rounded-xl border-2 border-gray-900/80 sm:mb-0 sm:mr-4",
              `genshin-bg-rarity-${character.rarity}`,
            )}
          >
            <Image
              className="h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40"
              src={`/characters/${character.id}/image.png`}
              alt={character.name}
              width={160}
              height={160}
            />
          </div>
          <div className="flex flex-grow flex-col space-y-2 text-center sm:text-left">
            <div className="mb-2 flex flex-col items-center sm:mb-0 sm:flex-row sm:items-center">
              <h1 className="mb-2 text-2xl text-white sm:mb-0 sm:mr-2 sm:text-3xl">
                {t("character_title", { name: character.name })}
              </h1>
              <ElementIcon
                type={common[character.element.name]}
                width={30}
                height={30}
              />
            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-1.5 sm:justify-start sm:gap-2">
              <WeaponTypeBadge weaponType={character.weapon_type} />
              <ElementBadge element={character.element} />
              <Badge
                variant="secondary"
                className="max-w-[120px] text-xs sm:max-w-none sm:text-sm"
              >
                <FaUserFriends className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="truncate">{character.affiliation}</span>
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <FaBirthdayCake className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="truncate">{character.birthday.join("/")}</span>
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                <FaStar className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="truncate">{character.constellation}</span>
              </Badge>
              <Badge
                variant="secondary"
                className="max-w-[120px] text-xs sm:max-w-none sm:text-sm"
              >
                <FaMapMarkedAlt className="mr-1 h-3 w-3 flex-shrink-0 sm:h-[14px] sm:w-[14px]" />
                <span className="truncate">{character.domain}</span>
              </Badge>
            </div>
            <blockquote className="mt-6 italic">
              {character.description}
            </blockquote>
          </div>
        </div>
      </div>
      {(character as any).beta ? (
        <div className="flex items-center justify-center px-4 sm:px-0">
          <div className="w-full rounded border border-red-400/50 bg-red-600/50 p-2 text-center text-white">
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
        <h2 className="mb-3 ml-4 text-3xl text-white md:ml-0">
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
              locale={lang}
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
          dangerouslySetInnerHTML={{
            __html: (detail.buildsNotes ?? "").replaceAll("<br>", "<br/>"),
          }}
        />
      ) : null}

      {detail.mubuild !== null ? (
        <CharacterCommonBuildCard
          build={detail.mubuild}
          artifacts={artifacts}
          weapons={weapons}
          locale={lang}
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
        {t("best_team_comp", { name: character.name })}
      </h2>
      <div className="card mx-2 mb-4 flex flex-wrap justify-between p-0 sm:mx-4 md:mx-0">
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
        {t("skills", { name: character.name })}
      </h2>
      <div
        className={cn(
          "relative z-20 mb-8 grid w-full grid-cols-1 gap-3 sm:gap-4",
          character.skills.length > 3
            ? "lg:grid-cols-3 xl:grid-cols-4"
            : "lg:grid-cols-3",
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
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">{t("passives")}</h2>
      <div className="mb-8 grid w-full grid-cols-1 gap-3 px-2 sm:gap-4 sm:px-4 lg:grid-cols-3">
        {character.passives.map((passive) => (
          <CharacterPassiveSkill
            key={passive.id}
            characterId={character.id}
            passive={passive}
          />
        ))}
      </div>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t("constellations")}
      </h2>
      <div className="mb-8 grid w-full grid-cols-1 gap-3 px-2 sm:gap-4 sm:px-4 lg:grid-cols-3">
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
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">{t("stats")}</h2>
      <div className="card mx-2 mb-8 sm:mx-4 lg:mx-0">
        {character.ascension[1].stats && (
          <CharacterStats ascensions={character.ascension} />
        )}
      </div>
      <h2 className="mb-2 ml-4 text-3xl text-white lg:ml-0">
        {t("ascension_materials")}
      </h2>
      <div className="card mx-2 mb-8 p-0 sm:mx-4 lg:mx-0">
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
        {t("talent_materials")}
      </h2>
      <div className="card mx-2 p-0 sm:mx-4 lg:mx-0">
        <CharacterTalentMaterials
          talents={character.talent_materials}
          talentsTotal={talentsTotal}
        />
      </div>
    </div>
  );
}
