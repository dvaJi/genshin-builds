import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { routing } from "@i18n/routing";
import type { Characters } from "@interfaces/zenless/characters";
import type { Tiers } from "@interfaces/zenless/tierlist";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";
import { cn } from "@lib/utils";

export const dynamic = "force-static";
export const revalidate = 43200;
type Props = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    type?: string;
  }>;
};

export async function generateStaticParams() {
  return routing.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang } = await params;
  const t = await getTranslations({
    locale: lang,
    namespace: "zenless.tierlist",
  });

  return genPageMetadata({
    title: t("title"),
    description: t("description"),
    path: `/zenless/w-engines`,
    locale: lang,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { lang } = await params;
  const { type } = await searchParams;
  setRequestLocale(lang);

  const t = await getTranslations("zenless.tierlist");
  const langData = getLangData(lang, "zenless");

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
    language: langData,
    select: ["id", "name", "rarity"],
    asMap: true,
  });

  return (
    <div className="px-4 md:px-0">
      <div className="my-4 md:my-6">
        <h1 className="mb-3 text-3xl font-semibold md:text-4xl">
          {t("tierlist_title")}
        </h1>
        <p className="text-sm text-neutral-200 md:text-base">
          {t("tierlist_description")}
        </p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center", "my-4"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>

      <div className="relative z-20 mb-6 flex flex-wrap gap-2 md:gap-4">
        <Link
          href={`/zenless/tierlist`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 py-2 text-sm font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4 md:px-4 md:text-base",
            table === "overall"
              ? "bg-neutral-600 text-white"
              : "bg-neutral-900",
          )}
        >
          {t("overall")}
        </Link>
        <Link
          href={`/zenless/tierlist?type=dps`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 py-2 text-sm font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4 md:px-4 md:text-base",
            table === "dps" ? "bg-neutral-600 text-white" : "bg-neutral-900",
          )}
        >
          {t("dps")}
        </Link>
        <Link
          href={`/zenless/tierlist?type=debuffer`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 py-2 text-sm font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4 md:px-4 md:text-base",
            table === "debuffer"
              ? "bg-neutral-600 text-white"
              : "bg-neutral-900",
          )}
        >
          {t("debuffer")}
        </Link>
        <Link
          href={`/zenless/tierlist?type=supporter`}
          className={cn(
            "rounded-2xl border-2 border-neutral-600 px-3 py-2 text-sm font-semibold ring-black transition-all hover:bg-neutral-600 hover:ring-4 md:px-4 md:text-base",
            table === "supporter"
              ? "bg-neutral-600 text-white"
              : "bg-neutral-900",
          )}
        >
          {t("supporter")}
        </Link>
      </div>

      <div className="mb-8 flex flex-col justify-center gap-4 rounded border border-neutral-800 bg-neutral-900 p-3 md:gap-6 md:p-4">
        {Object.entries(tierlist ?? {})
          .filter(([a]) => a !== "id")
          .map(([tier, chars]) => (
            <div
              key={tier}
              className="flex flex-col items-start gap-3 border-b border-neutral-950/50 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:gap-4"
            >
              <h3
                className={cn(
                  "text-xl font-semibold md:w-20 md:shrink-0 md:text-center md:text-2xl",
                  {
                    "text-red-500": tier === "Tier 0",
                    "text-yellow-500": tier === "Tier 1",
                    "text-green-500": tier === "Tier 2",
                    "text-blue-500": tier === "Tier 3",
                    "text-gray-500": tier === "Tier 4",
                  },
                )}
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
                        href={`/zenless/characters/${char}`}
                        className="flex flex-col items-center justify-center gap-2"
                      >
                        <div
                          className={cn(
                            `overflow-hidden rounded transition-all rarity-${characters[char].rarity} ring-0 ring-[#fbfe00] group-hover:ring-4`,
                          )}
                        >
                          <Image
                            className="h-16 w-16 scale-150 transition-transform ease-in-out group-hover:scale-125 md:h-24 md:w-24"
                            src={`/characters/portrait_${char}_2.webp`}
                            alt={characters[char].name}
                            width={130}
                            height={130}
                          />
                        </div>
                        <h3 className="w-20 truncate text-center text-xs text-white md:w-24 md:text-sm">
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

      <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
        {t("explanation")}
      </h2>
      <div className="flex flex-col justify-center gap-4 rounded border border-neutral-800 bg-neutral-900 p-3 md:gap-6 md:p-4">
        {Object.entries(explanations ?? {})
          .filter(([a]) => a !== "id")
          .map(([char, explanation]) => (
            <div
              key={char}
              className="flex flex-col items-start gap-3 border-b border-neutral-950/50 pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:gap-4"
            >
              <div className="flex flex-row items-center gap-2 md:w-20 md:shrink-0 md:flex-col">
                <Image
                  className="h-12 w-12 rounded-full md:h-16 md:w-16"
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
                className="text-sm text-neutral-100 md:text-base"
                dangerouslySetInnerHTML={{ __html: explanation }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
