import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import { getLangData } from "@i18n/langData";
import { Link } from "@i18n/navigation";
import { Items } from "@interfaces/hsr";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";
import { cn } from "@lib/utils";

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;
export const runtime = "edge";

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
    namespace: "HSR.item",
  });

  const langData = getLangData(lang, "hsr");

  const item = await getHSRData<Items>({
    resource: "items",
    language: langData,
    select: ["id", "name", "type"],
    filter: { id },
  });

  if (!item) {
    return;
  }

  const title = t("title", { itemName: item.name });
  const description = t("description", {
    itemName: item.name,
    itemType: item.type.name || "",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/item/${id}`,
    locale: lang,
  });
}

export default async function CharacterPage({ params }: Props) {
  const { lang, id } = await params;
  setRequestLocale(lang);

  const t = await getTranslations("HSR.item");
  const langData = getLangData(lang, "hsr");

  const item = await getHSRData<Items>({
    resource: "items",
    language: langData,
    select: ["id", "name", "type"],
    filter: { id },
  });

  if (!item) {
    return notFound();
  }

  return (
    <div>
      <div className="mx-1 mb-4 flex flex-col md:flex-row">
        <div className="flex justify-center">
          <img
            src={getHsrUrl(`/items/${item.id}.png`)}
            alt={item.name}
            width={144}
            height={168}
            className={cn("rounded border", {
              "border-yellow-400": item.rarity === 5,
              "border-purple-400": item.rarity === 4,
              "border-blue-400": item.rarity === 3,
              "border-green-400": item.rarity === 2,
              "border-zinc-400": item.rarity === 1,
            })}
          />
        </div>
        <div className="ml-4">
          <h2 className="flex items-center text-3xl font-semibold text-slate-50">
            {item.name}
          </h2>
          <p>{item.type.name}</p>
          <div className="flex items-center">
            <Stars stars={item.rarity} />
          </div>
          <p>{item.description}</p>
        </div>
      </div>
      <div className="card relative">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <h3 className="text-xl text-slate-200">{t("story")}</h3>
        {item.story ? (
          <div
            className="mb-4"
            dangerouslySetInnerHTML={{ __html: item.story }}
          />
        ) : null}
        <h3 className="text-xl text-slate-200">{t("source")}</h3>
        <div>
          {item.source?.map((s) => (
            <div
              key={s.description}
              className="mb-2 bg-hsr-surface2 p-2 last:mb-0"
            >
              <h4 className="text-slate-300">{s.description}</h4>
              <div>
                {s.recipe?.map((r) => (
                  <div key={r.worldLevelRequire || 0}>
                    {r.worldLevelRequire ? (
                      <div className="my-1 text-sm">
                        {t("world_level_require")}: {r.worldLevelRequire}
                      </div>
                    ) : null}
                    {r.coinCost ? (
                      <div className="my-1 text-sm">
                        {t("cost")}: {r.coinCost}
                      </div>
                    ) : null}
                    <div className="mt-2 flex gap-4">
                      {r.materialCost.map((m) => (
                        <Link
                          key={m.id}
                          href={`/hsr/item/${m.id}`}
                          className="relative flex h-16 w-16 flex-row justify-center"
                          data-tooltip-id="item_tooltip"
                          data-tooltip-content={m.name}
                          data-data-tooltip-place="bottom"
                        >
                          <img
                            loading="eager"
                            src={getHsrUrl(`/items/${m.id}.png`, 128, 128)}
                            className={cn(
                              "mb-1 rounded-full border-2 object-contain p-2",
                              {
                                "bg-yellow-600": m.rarity === 5,
                                "bg-purple-600": m.rarity === 4,
                                "bg-blue-600": m.rarity === 3,
                                "bg-green-600": m.rarity === 2,
                                "bg-zinc-600": m.rarity === 1,
                              },
                            )}
                            alt={m.name}
                          />
                          <span className="absolute bottom-0 rounded-md bg-slate-800 px-2 text-xs font-medium text-slate-100">
                            {m.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-4">
                      {r.specialMaterialCost.map((m) => (
                        <Link
                          key={m.id}
                          href={`/hsr/item/${m.id}`}
                          className="relative flex h-16 w-16 flex-row justify-center"
                          data-tooltip-id="item_tooltip"
                          data-tooltip-content={m.name}
                          data-data-tooltip-place="bottom"
                        >
                          <img
                            loading="eager"
                            src={getHsrUrl(`/items/${m.id}.png`, 128, 128)}
                            className={cn(
                              "mb-1 rounded-full border-2 object-contain p-2",
                              {
                                "bg-yellow-600": m.rarity === 5,
                                "bg-purple-600": m.rarity === 4,
                                "bg-blue-600": m.rarity === 3,
                                "bg-green-600": m.rarity === 2,
                                "bg-zinc-600": m.rarity === 1,
                              },
                            )}
                            alt={m.name}
                          />
                          <span className="absolute bottom-0 rounded-md bg-slate-800 px-2 text-xs font-medium text-slate-100">
                            {m.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
