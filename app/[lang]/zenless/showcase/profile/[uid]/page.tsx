import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { FaInfoCircle } from "react-icons/fa";

import { Card } from "@app/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@app/components/ui/tooltip";
import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import type { Characters } from "@interfaces/zenless/characters";
import { ShowcaseData } from "@interfaces/zenless/showcase-data";
import type { WEngines } from "@interfaces/zenless/wEngines";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";
import { db } from "@lib/db";
import { zzzBuilds, zzzPlayers } from "@lib/db/schema";

export const dynamic = "force-dynamic";
type Props = {
  params: {
    lang: string;
    uid: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, uid } = params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.profile",
  });

  return genPageMetadata({
    title: t("title", { uid }),
    description: t("description", { uid }),
    path: `/zenless/showcase/profile/${uid}`,
    locale: lang,
  });
}

export default async function ZenlessProfilePage({ params }: Props) {
  const { lang, uid } = params;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.profile");
  const langData = getLangData(lang, "zenless");

  // Get player and builds data
  const player = await db.query.zzzPlayers.findFirst({
    where: eq(zzzPlayers.uid, uid),
  });

  if (!player) {
    return notFound();
  }

  const builds = await db.query.zzzBuilds.findMany({
    where: eq(zzzBuilds.playerId, player.id),
  });

  if (!builds || builds.length === 0) {
    return notFound();
  }

  // Get character data for references
  const characters = await getZenlessData<Record<string, Characters>>({
    resource: "characters",
    language: langData,
    select: ["_id", "id", "name", "rarity", "element", "house", "type"],
    asMap: true,
  });

  const weapons = await getZenlessData<Record<string, WEngines>>({
    resource: "w-engines",
    language: langData,
    select: ["_id", "id", "name", "type", "rarity", "element", "icon"],
    asMap: true,
  });

  const showcaseData = await getZenlessData<ShowcaseData>({
    resource: "showcase",
    language: langData,
    filter: {
      id: "showcase",
    },
  });
  if (!showcaseData) {
    return notFound();
  }

  // Extract Player Profile from socialDetail
  const socialDetail = player.socialDetail;
  const profileDetail = socialDetail?.ProfileDetail;

  const pfp =
    showcaseData.pfps[profileDetail.ProfileId] ??
    Object.values(showcaseData.pfps)[0];
  const namecard =
    showcaseData.namecards[profileDetail.CallingCardId] ??
    Object.values(showcaseData.namecards)[0];
  const title =
    showcaseData.titles[profileDetail.Title] ??
    Object.values(showcaseData.titles)[0];

  // Get color values for title styling
  const titleText = showcaseData.loc[title.TitleText || ""];
  const titleColorA = title.ColorA || "#FFFFFF";
  const titleColorB = title.ColorB || "";
  const titleGradientStyle = titleColorB
    ? {
        background: `linear-gradient(0deg, #${titleColorA} 0%, #${titleColorB} 100%)`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : { color: `#${titleColorA}` };

  return (
    <div className="container mx-auto px-4 pb-10">
      <div className="relative w-full overflow-hidden rounded-lg">
        <Image
          src={`/showcase/${namecard.Icon.replace("/ui/zzz/", "")}`}
          fill
          alt={profileDetail?.Nickname || "Profile"}
          quality={40}
          className="object-cover"
        />
        <div className="relative z-10 w-full rounded-lg border-2 border-neutral-600 bg-background/80 p-4 ring-1 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative">
              <div className="overflow-hidden rounded-full ring-2 ring-yellow-400">
                <Image
                  src={`/showcase/${pfp.Icon.replace("/ui/zzz/", "")}`}
                  alt={profileDetail?.Nickname || "Profile"}
                  width={128}
                  height={128}
                  className="h-32 w-32"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="mb-2 text-center text-3xl font-semibold md:text-left">
                {profileDetail?.Nickname || "Unknown Player"}
              </h1>

              {title.TitleText && (
                <div className="mb-3">
                  <span
                    className="inline-block text-lg font-extrabold"
                    style={titleGradientStyle}
                  >
                    {titleText}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1 text-sm">
                <p className="flex items-center gap-2">
                  <span className="font-semibold">{t("uid")}:</span>
                  <span className="text-yellow-400">{uid}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">{t("level")}:</span>
                  <span>{profileDetail?.Level || "?"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">
                    {t("achievement_count")}:
                  </span>
                  <span>
                    {socialDetail?.MedalList?.find(
                      (medal) => medal.MedalType === 1,
                    )?.Value || "0"}
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-semibold">{t("last_updated")}:</span>
                  <span className="text-sm text-gray-400">
                    {new Date(player.updatedAt).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {socialDetail?.Desc && (
            <div className="mt-4 rounded-lg border border-neutral-700 bg-neutral-800 p-3">
              <p className="italic text-neutral-300">"{socialDetail.Desc}"</p>
            </div>
          )}
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />

      <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
        {t("character_showcase")}
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {builds.map((build) => {
          const avatar = build.info;
          const characterId = avatar?.Id;
          const characterData =
            characters && characterId
              ? Object.values(characters).find((c) => c._id === characterId)
              : null;
          if (!characterData) {
            return null; // Skip if character data is not found
          }

          // const showcaseAvatar =
          //   showcaseData.avatars[avatar?.Id] || showcaseData.avatars[0];

          const weaponData = Object.values(weapons ?? {}).find(
            (w) => w._id === avatar?.Weapon?.Id,
          );

          return (
            <Card
              key={avatar?.Id || build.id}
              className="overflow-hidden border-2 border-neutral-600"
            >
              <div className="relative">
                <div className="flex aspect-video items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900">
                  <Image
                    src={`/characters/portrait_${characterData.id}_2.webp`}
                    alt={characterData?.name || "Character"}
                    width={200}
                    height={200}
                    className="h-auto max-h-[220px] w-auto"
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {characterData?.name || "Unknown Character"}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-300">
                        <span>Lv. {avatar?.Level || "?"}</span>
                        {avatar?.PromotionLevel > 0 && (
                          <span className="ml-1 rounded bg-yellow-700 px-1 text-yellow-200">
                            +{avatar.PromotionLevel}
                          </span>
                        )}
                      </div>
                    </div>

                    {characterData && (
                      <Link
                        href={`/${lang}/zenless/characters/${characterData.id}`}
                        className="rounded-full bg-yellow-500 p-2 text-xs font-bold text-black transition-colors hover:bg-yellow-400"
                      >
                        {t("view_builds")}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3">
                <div className="mb-2 grid grid-cols-3 gap-2 text-sm">
                  {characterData?.element &&
                    characterData.element.length > 0 && (
                      <div className="flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1">
                        <span className="font-medium">{t("element")}:</span>
                        <span>{characterData.element[0]}</span>
                      </div>
                    )}

                  {characterData?.house && (
                    <div className="flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1">
                      <span className="font-medium">{t("house")}:</span>
                      <span>{characterData.house}</span>
                    </div>
                  )}

                  {characterData?.type && (
                    <div className="flex items-center gap-1 rounded-md bg-neutral-800 px-2 py-1">
                      <span className="font-medium">{t("type")}:</span>
                      <span>{characterData.type}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {avatar?.SkillLevelList && (
                    <div className="flex flex-wrap gap-1">
                      {avatar.SkillLevelList.map((skill, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="relative">
                                <Image
                                  src={`/icons/skill_${skill.Index}.png`}
                                  alt={`Skill ${skill.Index}`}
                                  width={40}
                                  height={40}
                                  className="rounded-md border border-neutral-700"
                                />
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-1 py-0.5 text-xs">
                                  {skill.Level}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="font-medium">
                                {t("skill_level")}: {skill.Level}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  )}

                  {/* Weapon section */}
                  {weaponData && (
                    <div className="mt-3 border-t border-neutral-700 pt-2">
                      <h4 className="mb-1 font-medium">{t("weapon")}</h4>
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="relative">
                                <Image
                                  src={`/w-engines/${weaponData.icon}.webp`}
                                  alt="Weapon"
                                  width={40}
                                  height={40}
                                  className="rounded-md border border-neutral-700"
                                />
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-1 py-0.5 text-xs">
                                  {avatar.Weapon.Level}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p className="text-xs">{weaponData.name}</p>
                              {avatar.Weapon.BreakLevel > 0 && (
                                <p className="text-xs text-yellow-400">
                                  +{avatar.Weapon.BreakLevel}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div>
                          <div className="text-xs">
                            Lv. {avatar.Weapon.Level}
                            {avatar.Weapon.BreakLevel > 0 && (
                              <span className="ml-1 text-yellow-400">
                                +{avatar.Weapon.BreakLevel}
                              </span>
                            )}
                          </div>
                          {avatar.Weapon.UpgradeLevel > 0 && (
                            <div className="text-xs text-yellow-400">
                              Refinement: {avatar.Weapon.UpgradeLevel}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Equipment section */}
                  <TooltipProvider>
                    {avatar?.EquippedList && avatar.EquippedList.length > 0 && (
                      <div className="mt-3 border-t border-neutral-700 pt-2">
                        <h4 className="mb-1 font-medium">{t("equipment")}</h4>
                        <div className="flex flex-wrap gap-1">
                          {avatar.EquippedList.map((equipment, index) => {
                            console.log(equipment.Slot, equipment.Equipment.Id);
                            const itemData =
                              showcaseData.equipments.Items[
                                equipment.Equipment.Id
                              ];
                            if (!itemData) {
                              return null; // Skip if equipment data is not found
                            }

                            const suitData =
                              showcaseData.equipments.Suits[itemData.SuitId];

                            return (
                              <Tooltip key={index}>
                                <TooltipTrigger>
                                  <div className="relative">
                                    <Image
                                      src={`/showcase/${suitData.Icon.replace(
                                        "/ui/zzz/",
                                        "",
                                      )}`}
                                      alt={`Equipment ${equipment.Slot}`}
                                      width={40}
                                      height={40}
                                      className="rounded-md border border-neutral-700"
                                    />
                                    <div className="absolute -bottom-1 -right-1 rounded-full bg-black px-1 py-0.5 text-xs">
                                      {equipment.Equipment?.Level}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                  <p className="text-xs">
                                    Lv. {equipment.Equipment?.Level}
                                  </p>
                                  {equipment.Equipment?.BreakLevel > 0 && (
                                    <p className="text-xs text-yellow-400">
                                      +{equipment.Equipment.BreakLevel}
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center", "my-6"]}
      />

      <div className="mt-6 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
        <div className="flex items-center gap-2">
          <FaInfoCircle className="text-yellow-400" />
          <h3 className="text-lg font-medium">{t("showcase_note_title")}</h3>
        </div>
        <p className="mt-2 text-sm text-neutral-300">
          {t("showcase_note_description")}
        </p>
        <div className="mt-4 flex justify-center">
          <Link
            href={`/${lang}/zenless/showcase`}
            className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-black transition-all hover:bg-yellow-400"
          >
            {t("update_showcase")}
          </Link>
        </div>
      </div>
    </div>
  );
}
