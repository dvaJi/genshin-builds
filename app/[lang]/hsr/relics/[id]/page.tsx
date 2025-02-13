import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/hsr/Image";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import getTranslations from "@hooks/use-translations";
import type { Character, Relic } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";
import { getStarRailBuild } from "@lib/localData";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function generateStaticParams() {
  const routes: { lang: string; id: string }[] = [];

  for await (const lang of i18n.locales) {
    const relics = await getHSRData<Relic[]>({
      resource: "relics",
      language: lang,
      select: ["id"],
    });

    routes.push(
      ...relics.map((relic) => ({
        lang,
        id: relic.id,
      })),
    );
  }

  return routes;
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
  const { t, langData, locale } = await getTranslations(lang, "hsr", "relics");

  const relic = await getHSRData<Relic>({
    resource: "relics",
    language: langData,
    filter: { id },
  });

  if (!relic) {
    return;
  }

  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail {name} Relic Set Details",
    values: { name: relic.name },
  });

  const description = t({
    id: "description",
    defaultMessage:
      "{name} is a relic set in Honkai: Star Rail. Learn about its pieces, effects and best characters to use it on.",
    values: { name: relic.name },
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/relics/${id}`,
    image: getHsrUrl(`/relics/${relic.id}.png`),
    locale,
  });
}

export default async function RelicPage({ params }: Props) {
  const { lang, id } = await params;
  const { t, langData } = await getTranslations(lang, "hsr", "relics");

  const relic = await getHSRData<Relic>({
    resource: "relics",
    language: langData,
    filter: { id },
  });

  if (!relic) {
    return notFound();
  }

  // Get all characters to find who uses this relic
  const characters = await getHSRData<Character[]>({
    resource: "characters",
    language: langData,
    select: ["id", "name", "rarity", "path", "combat_type"],
  });

  // Get all character builds to find who uses this relic
  const characterBuilds = await Promise.all(
    characters.map(async (char) => {
      const build = await getStarRailBuild(char.id);
      if (!build) return null;

      const relicSetData = build.relics.set.find((set) =>
        set.ids.includes(relic.id),
      );
      const isOrnament = build.relics.ornament.includes(relic.id);
      const isRecommended = relicSetData || isOrnament;

      if (isRecommended) {
        return {
          character: char,
          setCount: relicSetData?.amount ?? 0,
          isOrnament,
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
        setCount: number;
        isOrnament: boolean;
      } => item !== null,
    )
    .sort((a, b) => {
      // Sort by rarity first, then by set count, then by name
      if (a.character.rarity !== b.character.rarity) {
        return b.character.rarity - a.character.rarity;
      }
      if (a.setCount !== b.setCount) {
        return b.setCount - a.setCount;
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
                src={getHsrUrl(`/relics/${relic.id}.png`, 256, 256)}
                alt={relic.name}
                width={256}
                height={256}
                className="rounded-lg border border-border"
                loading="eager" // Main hero image should load eagerly
              />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-semibold text-accent">
                  {relic.name}
                </h1>
                <div className="mt-4">
                  {Object.entries(relic.effects).map(([pieces, effect]) => (
                    <div key={pieces} className="mb-4">
                      <div className="mb-2 font-semibold text-card-foreground">
                        {pieces}{" "}
                        {t({ id: "piece_set", defaultMessage: "Piece Set" })}
                      </div>
                      <p
                        className="text-sm"
                        dangerouslySetInnerHTML={{ __html: effect }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-4 text-xl font-semibold text-accent">
                  {t({ id: "relic_pieces", defaultMessage: "Relic Pieces" })}
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {relic.pieces.map((piece) => (
                    <div
                      key={piece.id}
                      className="flex items-center rounded border border-border bg-background p-4"
                    >
                      <img
                        src={getHsrUrl(`/pieces/${piece.id}.png`, 64, 64)}
                        alt={piece.name}
                        width={64}
                        height={64}
                        className="mr-4"
                        loading="lazy"
                      />
                      <div>
                        <div className="font-medium text-card-foreground">
                          {piece.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {piece.type}
                        </div>
                        <blockquote className="mt-6 border-l-2 pl-6 text-sm italic">
                          {piece.backstory}
                        </blockquote>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredCharacterBuilds.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold text-accent">
                    {t({
                      id: "recommended_characters",
                      defaultMessage: "Recommended Characters",
                    })}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {filteredCharacterBuilds.map(
                      ({ character, setCount, isOrnament }) => (
                        <Link
                          key={character.id}
                          href={`/${lang}/hsr/character/${character.id}`}
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
                              {isOrnament ? (
                                <span className="rounded bg-accent/20 px-1.5 py-0.5 text-xs text-accent">
                                  Ornament
                                </span>
                              ) : (
                                setCount > 0 && (
                                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                    {setCount}pc
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
    </div>
  );
}
