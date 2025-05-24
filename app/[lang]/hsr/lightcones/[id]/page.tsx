import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Separator } from "@app/components/ui/separator";
import { genPageMetadata } from "@app/seo";
import Image from "@components/hsr/Image";
import LightConeStats from "@components/hsr/LightConeStats";
import LightConeSuperimposition from "@components/hsr/LightConeSuperimposition";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import type { Character, LightCone } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";
import { getStarRailBuild } from "@lib/localData";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{
    id: string;
    lang: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "HSR.lightcones",
  });
  const langData = getLangData(lang, "hsr");

  const lightcone = await getHSRData<LightCone>({
    resource: "lightcones",
    language: langData,
    filter: { id },
  });

  if (!lightcone) {
    return;
  }

  const title = t("title", { name: lightcone.name });
  const description = t("description", {
    name: lightcone.name,
    rarity: lightcone.rarity.toString(),
    path: lightcone.pathTypeText,
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/lightcones/${id}`,
    image: getHsrUrl(`/lightcones/${lightcone.id}.png`),
    locale: lang,
  });
}

export default async function LightConePage({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.lightcones");
  const langData = getLangData(lang, "hsr");

  const lightcone = await getHSRData<LightCone>({
    resource: "lightcones",
    language: langData,
    filter: { id },
  });

  if (!lightcone) {
    return notFound();
  }

  // Get all characters to find who uses this lightcone
  const characters = await getHSRData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity", "path", "combat_type"],
  });

  // Get all character builds and process the data
  const characterBuilds = await Promise.all(
    characters.map(async (char) => {
      const build = await getStarRailBuild(char.id);
      if (!build) return null;

      const isBestLightCone = build.builds.some(
        (b) => b.data.bestLightCone === lightcone.id,
      );
      const isAlternative = build.lightcones.includes(lightcone.id);
      const isRecommended = isBestLightCone || isAlternative;

      if (isRecommended) {
        return {
          character: char,
          isBestLightCone,
          isAlternative,
        };
      }
      return null;
    }),
  );

  const filteredCharacterBuilds = characterBuilds
    .filter(
      (
        item,
      ): item is {
        character: Character;
        isBestLightCone: boolean;
        isAlternative: boolean;
      } => item !== null,
    )
    .sort((a, b) => {
      // Sort by Best in Slot first, then by character rarity, then by name
      if (a.isBestLightCone !== b.isBestLightCone) {
        return a.isBestLightCone ? -1 : 1;
      }
      if (a.character.rarity !== b.character.rarity) {
        return b.character.rarity - a.character.rarity;
      }
      return a.character.name.localeCompare(b.character.name);
    });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 mt-4">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-4" adSlot={AD_ARTICLE_SLOT} />

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="flex-shrink-0">
              <img
                src={getHsrUrl(`/lightcones/${lightcone.id}.png`, 256, 256)}
                alt={lightcone.name}
                width={256}
                height={256}
                className="rounded-lg border border-border"
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-accent">
                  {lightcone.name}
                </h1>
                <div className="mt-2 flex items-center gap-4">
                  <Stars stars={lightcone.rarity} />
                  <div className="flex items-center">
                    <img
                      src={getHsrUrl(
                        `/${lightcone.pathType.toLowerCase()}.webp`,
                      )}
                      alt={lightcone.pathTypeText}
                      width={24}
                      height={24}
                      className="mr-2"
                    />
                    <span className="text-card-foreground">
                      {lightcone.pathTypeText}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-accent">
                  {t("ability")}: {lightcone.effectName}
                </h2>
                <LightConeSuperimposition lightcone={lightcone} />
              </div>
              <Separator className="my-4" />
              <FrstAds
                placementName="genshinbuilds_incontent_1"
                classList={["flex", "justify-center"]}
              />
              <Separator className="my-4" />

              <h2 className="text-xl font-semibold text-accent">
                {t("stats")}
              </h2>
              {lightcone.ascend && lightcone.ascend.length > 0 && (
                <LightConeStats lightcone={lightcone} />
              )}

              <Separator className="my-4" />
              <FrstAds
                placementName="genshinbuilds_incontent_2"
                classList={["flex", "justify-center"]}
              />
              <Separator className="my-4" />

              {filteredCharacterBuilds.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-accent">
                    {t("recommended_characters")}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {filteredCharacterBuilds.map(
                      ({ character, isBestLightCone, isAlternative }) => (
                        <Link
                          key={character.id}
                          href={`/hsr/character/${character.id}`}
                          className="group flex items-center rounded border border-border bg-background p-2 transition-colors hover:border-accent"
                        >
                          <Image
                            src={`/characters/${character.id}/icon_2.png`}
                            alt={character.name}
                            width={48}
                            height={48}
                            className="rounded"
                          />
                          <div className="ml-2">
                            <div className="font-medium text-card-foreground group-hover:text-accent">
                              {character.name}
                            </div>
                            <div className="flex items-center gap-2">
                              <Stars stars={character.rarity} />
                              {isBestLightCone ? (
                                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                                  {t("best_in_slot")}
                                </span>
                              ) : (
                                isAlternative && (
                                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                    {t("alternative")}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FrstAds
        placementName="genshinbuilds_incontent_3"
        classList={["flex", "justify-center"]}
      />
    </div>
  );
}
