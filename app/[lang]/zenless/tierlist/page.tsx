import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import type { Characters } from "@interfaces/zenless/characters";
import type { Tiers } from "@interfaces/zenless/tierlist";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";
import { cn } from "@lib/utils";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const title =
    "Best Zenless Zone Zero (ZZZ) Characters Tierlist - Ultimate Ranking Guide";
  const description =
    "Explore the best Zenless Zone Zero Characters Tierlist. Discover detailed rankings and character insights. Find out who tops the list!";

  return genPageMetadata({
    title,
    description,
    path: `/zenless/tierlist`,
    locale: lang,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  const { type } = await searchParams;
  const table = type ?? "overall";
  const tierlist = await getZenlessData<Tiers>({
    resource: "tierlist",
    filter: {
      id: table,
    },
  });
  const explanations = await getZenlessData<Record<string, string>>({
    resource: "tierlist",
    filter: {
      id: "explanations",
    },
  });

  if (!tierlist || table === "explanations") {
    return notFound();
  }

  const characters = await getZenlessData<Record<string, Characters>>({
    resource: "characters",
    language: lang,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  return (
    <div className="px-4 md:px-0">
      <div className="my-4 md:my-6">
        <h1 className="text-3xl md:text-4xl font-semibold mb-3">
          Zenless Zone Zero (ZZZ) Tier List and Best Characters
        </h1>
        <p className="text-sm md:text-base text-neutral-200">
          Welcome to our comprehensive Zenless Zone Zero (ZZZ) Agents Tierlist.
          Here, we rank the Agents based on their abilities, strengths, and
          overall utility in the game along with an explanation of how good they
          are as DPS, Debuffers, and Assist characters. Whether you&apos;re a
          beginner or a seasoned player, this guide will help you make informed
          decisions.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center", "my-4"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="relative z-20 mb-6 flex flex-wrap gap-2 md:gap-4">
        <Link
          href={`/${lang}/zenless/tierlist`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 md:px-4 py-2 text-sm md:text-base font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "overall" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          Overall
        </Link>
        <Link
          href={`/${lang}/zenless/tierlist?type=dps`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 md:px-4 py-2 text-sm md:text-base font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "dps" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          DPS
        </Link>
        <Link
          href={`/${lang}/zenless/tierlist?type=debuffer`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 md:px-4 py-2 text-sm md:text-base font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "debuffer" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          Debuffer
        </Link>
        <Link
          href={`/${lang}/zenless/tierlist?type=supporter`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 md:px-4 py-2 text-sm md:text-base font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "supporter" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          Supporter
        </Link>
      </div>

      <div className="mb-8 flex flex-col justify-center gap-4 md:gap-6 rounded border border-neutral-800 bg-neutral-900 p-3 md:p-4">
        {Object.entries(tierlist ?? {})
          .filter(([a]) => a !== "id")
          .map(([tier, chars]) => (
            <div
              key={tier}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 border-b border-neutral-950/50 pb-4 last:border-b-0 last:pb-0"
            >
              <h3
                className={cn("text-xl md:text-2xl font-semibold md:w-20 md:shrink-0 md:text-center", {
                  "text-red-500": tier === "Tier 0",
                  "text-yellow-500": tier === "Tier 1",
                  "text-green-500": tier === "Tier 2",
                  "text-blue-500": tier === "Tier 3",
                  "text-gray-500": tier === "Tier 4",
                })}
              >
                {tier}
              </h3>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {chars?.map((char: string) => (
                  <div
                    key={char}
                    className="group flex flex-col items-center justify-center gap-2"
                  >
                    {characters?.[char] ? (
                      <Link
                        href={`/${lang}/zenless/characters/${char}`}
                        className="flex flex-col items-center justify-center gap-2"
                        prefetch={false}
                      >
                        <div
                          className={cn(
                            `overflow-hidden rounded transition-all rarity-${characters[char].rarity} ring-0 ring-[#fbfe00] group-hover:ring-4`
                          )}
                        >
                          <Image
                            className="h-16 w-16 md:h-24 md:w-24 scale-150 transition-transform ease-in-out group-hover:scale-125"
                            src={`/characters/portrait_${char}_2.webp`}
                            alt={characters[char].name}
                            width={130}
                            height={130}
                          />
                        </div>
                        <h3 className="w-20 md:w-24 truncate text-center text-xs md:text-sm text-white">
                          {characters[char].name}
                        </h3>
                      </Link>
                    ) : (
                      char
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <FrstAds
        placementName="genshinbuilds_incontent_1"
        classList={["flex", "justify-center"]}
      />

      <h2 className="text-2xl md:text-3xl font-semibold mb-4">Explanation</h2>
      <div className="flex flex-col justify-center gap-4 md:gap-6 rounded border border-neutral-800 bg-neutral-900 p-3 md:p-4">
        {Object.entries(explanations ?? {})
          .filter(([a]) => a !== "id")
          .map(([char, explanation]) => (
            <div
              key={char}
              className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 border-b border-neutral-950/50 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex md:w-20 md:shrink-0 flex-row md:flex-col items-center gap-2">
                <Image
                  className="rounded-full h-12 w-12 md:h-16 md:w-16"
                  src={`/characters/portrait_${char}_2.webp`}
                  alt={characters?.[char]?.name ?? char}
                  width={60}
                  height={60}
                />
                <span className="text-center text-sm">
                  {characters?.[char]?.name}
                </span>
              </div>
              <div
                className="text-sm md:text-base text-neutral-100"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
