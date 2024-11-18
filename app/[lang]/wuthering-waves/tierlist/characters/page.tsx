import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import { Characters } from "@interfaces/wuthering-waves/characters";
import type { TierlistCharacters } from "@interfaces/wuthering-waves/tierlist-characters";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    type?: string;
  }>;
};
const tables = ["overall", "mainDPS", "subDPS", "support"] as const;

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const title =
    "Best Wuthering Waves (WuWa) Characters Tierlist - Ultimate Ranking Guide";
  const description =
    "Explore the best Wuthering Waves Characters Tierlist. Discover detailed rankings and character insights. Find out who tops the list!";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/tierlist/characters`,
    locale: lang,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  const tierlist = await getWWData<TierlistCharacters>({
    resource: "tierlist",
    language: lang,
    filter: {
      id: "characters",
    },
  });

  const characters = await getWWData<Record<string, Characters>>({
    resource: "characters",
    language: lang,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  const { type } = await searchParams;
  const table = type ?? "overall";

  // if (!tables.includes(table as any)) {
  //   return redirect(`/wuthering-waves/tierlist/characters`);
  // }
  const tiers = tierlist?.[table as (typeof tables)[number]];

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">
          Wuthering Waves (WuWa) Characters Tierlist - Ultimate Ranking and
          Analysis
        </h2>
        <p>
          Welcome to our comprehensive Wuthering Waves Characters Tierlist.
          Here, we rank the characters based on their abilities, strengths, and
          overall utility in the game. Whether you&apos;re a beginner or a
          seasoned player, this guide will help you make informed decisions.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="mx-2 my-4 flex gap-4 md:mx-0">
        <Link
          href={`/${lang}/wuthering-waves/tierlist/characters`}
          className={clsx(
            "rounded-md border border-ww-700 px-3 py-2 hover:opacity-80",
            table === "overall" ? "bg-ww-900 text-white" : "bg-ww-950"
          )}
        >
          Overall
        </Link>
        <Link
          href={`/${lang}/wuthering-waves/tierlist/characters?type=mainDPS`}
          className={clsx(
            "rounded-md border border-ww-700 px-3 py-2 hover:opacity-80",
            table === "mainDPS" ? "bg-ww-900 text-white" : "bg-ww-950"
          )}
        >
          Main DPS
        </Link>
        <Link
          href={`/${lang}/wuthering-waves/tierlist/characters?type=subDPS`}
          className={clsx(
            "rounded-md border border-ww-700 px-3 py-2 hover:opacity-80",
            table === "subDPS" ? "bg-ww-900 text-white" : "bg-ww-950"
          )}
        >
          Sub DPS
        </Link>
        <Link
          href={`/${lang}/wuthering-waves/tierlist/characters?type=support`}
          className={clsx(
            "rounded-md border border-ww-700 px-3 py-2 hover:opacity-80",
            table === "support" ? "bg-ww-900 text-white" : "bg-ww-950"
          )}
        >
          Support
        </Link>
      </div>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tiers ?? {}).map(([tier, chars]) => (
          <div
            key={tier}
            className="flex items-center gap-2 border-b border-ww-950/50 pb-4 last:border-b-0"
          >
            <h3
              className={clsx("w-20 shrink-0 text-center text-2xl", {
                "text-red-500": tier === "SS",
                "text-yellow-500": tier === "S",
                "text-green-500": tier === "A",
                "text-blue-500": tier === "B",
                "text-gray-500": tier === "C",
              })}
            >
              {tier}
            </h3>
            <div className="flex flex-wrap gap-4">
              {chars.map((char: string) => (
                <div
                  key={char}
                  className="group flex flex-col items-center justify-center gap-2"
                >
                  {characters?.[char] ? (
                    <Link
                      href={`/${lang}/wuthering-waves/characters/${char}`}
                      className="flex flex-col items-center justify-center gap-2"
                      prefetch={false}
                    >
                      <div
                        className={clsx(
                          `overflow-hidden rounded transition-all rarity-${characters[char].rarity} ring-0 ring-ww-800 group-hover:ring-4`
                        )}
                      >
                        <Image
                          className="transition-transform ease-in-out group-hover:scale-110"
                          src={`/characters/thumb_${char}.webp`}
                          alt={characters[char].name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <h3 className="w-24 truncate text-center text-sm text-ww-100 group-hover:text-white">
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
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">Explanation</h2>
      <div className="flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.explanations ?? {}).map(
          ([char, explanation]) => (
            <div
              key={char}
              className="flex items-center gap-2 border-b border-ww-950/50 pb-4 last:border-b-0"
            >
              <div className="flex w-20 shrink-0 flex-col items-center gap-2">
                <Image
                  className="rounded-full"
                  src={`/characters/thumb_${char}.webp`}
                  alt={characters?.[char].name ?? char}
                  width={60}
                  height={60}
                />
                <span className="text-center text-sm">
                  {characters?.[char].name}
                </span>
              </div>
              <div
                className="text-sm text-ww-100"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
