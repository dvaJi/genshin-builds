import { i18n } from "i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import getTranslations from "@hooks/use-translations";
import type { Echoes } from "@interfaces/wuthering-waves/echoes";
import type { TierlistEchoes } from "@interfaces/wuthering-waves/tierlist-echoes";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { cn } from "@lib/utils";

type Props = {
  params: Promise<{ lang: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;






export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "tierlist_echoes"
  );

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/wuthering-waves/tierlist/echoes`,
    locale: langData,
  });
}

export default async function Page({ params }: Props) {
  const { lang } = await params;
  const { t, langData } = await getTranslations(
    lang,
    "wuthering-waves",
    "tierlist_echoes"
  );
  const tierlist = await getWWData<TierlistEchoes>({
    resource: "tierlist",
    filter: {
      id: "echoes",
    },
  });

  const echoes = await getWWData<Record<string, Echoes>>({
    resource: "echoes",
    language: langData,
    select: ["id", "name", "intensityCode", "icon"],
    asMap: true,
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">{t("main_title")}</h2>
        <p>{t("main_description")}</p>

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
              className={cn("w-20 shrink-0 text-center text-2xl", {
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
                        className={cn(
                          `overflow-hidden rounded ring-0 ring-ww-800 transition-all group-hover:ring-4`,
                          `rarity-${echoes[char].intensityCode + 1}`
                        )}
                      >
                        <Image
                          className="transition-transform ease-in-out group-hover:scale-110"
                          src={`/echoes/${echoes?.[char]?.icon.split("/").pop()}.webp`}
                          alt={echoes?.[char]?.name ?? char}
                          width={100}
                          height={100}
                        />
                      </div>
                      <h3 className="w-24 truncate text-center text-sm text-ww-100 group-hover:text-white">
                        {echoes?.[char]?.name ?? char}
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
      <h2 className="mx-2 mb-2 text-xl text-ww-50 lg:mx-0">
        {t("explanation")}
      </h2>
      <div className="flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {Object.entries(tierlist?.explanations ?? {}).map(
          ([char, explanation]) => (
            <Link
              key={char}
              href={`/${lang}/wuthering-waves/echoes/${char.replace("é", "e")}`}
              className="flex items-center gap-2 border-b border-ww-950/50 pb-4 last:border-b-0"
            >
              <div className="flex w-20 shrink-0 flex-col items-center gap-2">
                <Image
                  className="rounded-full"
                  src={`/echoes/${echoes?.[char]?.icon.split("/").pop()}.webp`}
                  alt={echoes?.[char].name ?? char}
                  width={60}
                  height={60}
                />
                <span className="text-center text-sm">
                  {echoes?.[char]?.name ?? char}
                </span>
              </div>
              <div
                className="text-sm text-ww-100"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            </Link>
          )
        )}
      </div>
    </div>
  );
}
