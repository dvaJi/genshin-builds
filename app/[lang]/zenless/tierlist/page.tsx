import clsx from "clsx";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Image from "@components/zenless/Image";
import type { Characters } from "@interfaces/zenless/characters";
import type { Tiers } from "@interfaces/zenless/tierlist";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
  searchParams?: {
    type?: string;
  };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const title =
    "Best Zenless Zone Zero (ZZZ) Characters Tierlist - Ultimate Ranking Guide";
  const description =
    "Explore the best Zenless Zone Zero Characters Tierlist. Discover detailed rankings and character insights. Find out who tops the list!";

  return genPageMetadata({
    title,
    description,
    path: `/zenless/tierlist`,
    locale: params.lang,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const table = searchParams?.type ?? "overall";
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
    language: params.lang,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  console.log(Object.entries(tierlist ?? {}), characters);

  return (
    <div>
      <div className="my-2">
        <h1 className="text-4xl font-semibold">
          Zenless Zone Zero (ZZZ) Tier List and Best Characters
        </h1>
        <p>
          Welcome to our comprehensive Zenless Zone Zero (ZZZ) Agents Tierlist.
          Here, we rank the Agents based on their abilities, strengths, and
          overall utility in the game along with an explanation of how good they
          are as DPS, Debuffers, and Assist characters. Whether you&apos;re a
          beginner or a seasoned player, this guide will help you make informed
          decisions.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="relative z-20 mx-2 my-4 flex gap-4 md:mx-0">
        <Link
          href={`/${params.lang}/zenless/tierlist`}
          className={clsx(
            "rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "overall" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          Overall
        </Link>
        <Link
          href={`/${params.lang}/zenless/tierlist?type=dps`}
          className={clsx(
            "rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "dps" ? "bg-neutral-600 text-white" : "bg-neutral-900"
          )}
        >
          DPS
        </Link>
        <Link
          href={`/${params.lang}/zenless/tierlist?type=debuffer`}
          className={clsx(
            "rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "debuffer"
              ? "bg-neutral-600 text-white"
              : "bg-neutral-900"
          )}
        >
          Debuffer
        </Link>
        <Link
          href={`/${params.lang}/zenless/tierlist?type=supporter`}
          className={clsx(
            "rounded-2xl border-2 border-neutral-600 px-4 py-2 font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4",
            table === "supporter"
              ? "bg-neutral-600 text-white"
              : "bg-neutral-900"
          )}
        >
          Supporter
        </Link>
      </div>
      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {Object.entries(tierlist ?? {})
          .filter(([a]) => a !== "id")
          .map(([tier, chars]) => (
            <div
              key={tier}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <h3
                className={clsx("w-20 shrink-0 text-center text-2xl", {
                  "text-red-500": tier === "Tier 0",
                  "text-yellow-500": tier === "Tier 1",
                  "text-green-500": tier === "Tier 2",
                  "text-blue-500": tier === "Tier 3",
                  "text-gray-500": tier === "Tier 4",
                })}
              >
                {tier}
              </h3>
              <div className="flex flex-wrap gap-4">
                {chars?.map((char: string) => (
                  <div
                    key={char}
                    className="group flex flex-col items-center justify-center gap-2"
                  >
                    {characters?.[char] ? (
                      <Link
                        href={`/${params.lang}/zenless/characters/${char}`}
                        className="flex flex-col items-center justify-center gap-2"
                        prefetch={false}
                      >
                        <div
                          className={clsx(
                            `overflow-hidden rounded transition-all rarity-${characters[char].rarity} ring-0 ring-[#fbfe00] group-hover:ring-4`
                          )}
                        >
                          <Image
                            className="h-24 w-24 scale-150 transition-transform ease-in-out group-hover:scale-125"
                            src={`/characters/portrait_${char}_2.webp`}
                            alt={characters[char].name}
                            width={130}
                            height={130}
                          />
                        </div>
                        <h3 className="w-24 truncate text-center text-sm text-white">
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
      <h2 className="text-2xl font-semibold">Explanation</h2>
      <div className="flex flex-col justify-center gap-6 rounded border border-neutral-800 bg-neutral-900 p-4">
        {Object.entries(explanations ?? {})
          .filter(([a]) => a !== "id")
          .map(([char, explanation]) => (
            <div
              key={char}
              className="flex items-center gap-2 border-b border-neutral-950/50 pb-4 last:border-b-0"
            >
              <div className="flex w-20 shrink-0 flex-col items-center gap-2">
                <Image
                  className="rounded-full"
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
                className="text-sm text-neutral-100"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
