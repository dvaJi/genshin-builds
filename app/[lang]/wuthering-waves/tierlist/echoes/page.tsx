import clsx from "clsx";
import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import type { Echoes } from "@interfaces/wuthering-waves/echoes";
import type { TierlistEchoes } from "@interfaces/wuthering-waves/tierlist-echoes";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const title =
    "Best Wuthering Waves (WuWa) Echoes Tierlist - Ultimate Ranking Guide";
  const description =
    "Explore the best Wuthering Waves Echoes Tierlist. Discover detailed rankings and Echoes insights. Find out which Echoes boost your Resonator's stats!";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/tierlist/echoes`,
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const tierlist = await getWWData<TierlistEchoes>({
    resource: "tierlist",
    language: lang,
    filter: {
      id: "echoes",
    },
  });

  const echoes = await getWWData<Record<string, Echoes>>({
    resource: "echoes",
    language: lang,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">
          Wuthering Waves (WuWa) Echoes Tierlist - Ultimate Ranking and Analysis
        </h2>
        <p>
          Welcome to our comprehensive Wuthering Waves Echoes Tierlist. Here, we
          rank the Echoes based on their ability to boost stats like HP, ATK,
          and Energy Regeneration. Whether you&apos;re a beginner or a seasoned
          player, this guide will help you optimize your Resonator&apos;s
          performance.
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="mb-8 flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.tiers ?? {}).map(([tier, chars]) => (
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
                  {echoes?.[char] ? (
                    <Link
                      href={`/${lang}/wuthering-waves/echoes/${char.replace("é", "e")}`}
                      className="flex flex-col items-center justify-center gap-2"
                      prefetch={false}
                    >
                      <div
                        className={clsx(
                          `overflow-hidden rounded ring-0 ring-ww-800 transition-all group-hover:ring-4`
                        )}
                      >
                        <Image
                          className="transition-transform ease-in-out group-hover:scale-110"
                          src={`/echoes/${char.replace("é", "e")}.webp`}
                          alt={echoes[char].name}
                          width={100}
                          height={100}
                        />
                      </div>
                      <h3 className="w-24 truncate text-center text-sm text-ww-100 group-hover:text-white">
                        {echoes[char].name}
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
                  src={`/echoes/${char.replace("é", "e")}.webp`}
                  alt={echoes?.[char].name ?? char}
                  width={60}
                  height={60}
                />
                <span className="text-center text-sm">
                  {echoes?.[char].name}
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
