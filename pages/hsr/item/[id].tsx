import clsx from "clsx";
import HSRData from "hsr-data";
import { Items } from "hsr-data/dist/types/items";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Tooltip } from "react-tooltip";

import useIntl, { IntlFormatProps } from "@hooks/use-intl";

import Metadata from "@components/Metadata";
import Stars from "@components/hsr/Stars";

import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl, getHsrUrlLQ } from "@lib/imgUrl";
import { getCommon, getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

interface Props {
  item: Items;
  locale: string;
}

const HSRItemPage = ({ item, locale }: Props) => {
  const { t } = useIntl("item");

  return (
    <div>
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail {itemName} Item",
          values: { itemName: item.name },
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "Information about the {itemName} {itemType} item.",
          values: {
            itemName: item.name,
            itemType: item.type.name || "",
          },
        })}
        jsonLD={generateJsonLd(locale, t)}
      />
      <div className="mx-1 mb-4 flex flex-col md:flex-row">
        <div className="flex justify-center">
          <img
            src={getHsrUrl(`/items/${item.id}.png`)}
            alt={item.name}
            width={144}
            height={168}
            className={clsx("rounded border", {
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
      <div className="relative bg-hsr-surface1 p-4 shadow-2xl">
        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
        <h3 className="text-xl text-slate-200">
          {t({
            id: "story",
            defaultMessage: "Story",
          })}
        </h3>
        <div
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: item.story }}
        />
        <h3 className="text-xl text-slate-200">
          {t({
            id: "source",
            defaultMessage: "Source",
          })}
        </h3>
        <div>
          {item.source.map((s) => (
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
                        {t({
                          id: "world_level_require",
                          defaultMessage: "World Level Require",
                        })}
                        : {r.worldLevelRequire}
                      </div>
                    ) : null}
                    {r.coinCost ? (
                      <div className="my-1 text-sm">
                        {t({
                          id: "cost",
                          defaultMessage: "Cost",
                        })}
                        : {r.coinCost}
                      </div>
                    ) : null}
                    <div className="mt-2 flex gap-4">
                      {r.materialCost.map((m) => (
                        <Link
                          href={`/hsr/item/${m.id}`}
                          key={m.id}
                          className="relative flex h-16 w-16 flex-row justify-center"
                          data-tooltip-id="item_tooltip"
                          data-tooltip-content={m.name}
                          data-data-tooltip-place="bottom"
                        >
                          <img
                            loading="eager"
                            src={getHsrUrl(`/items/${m.id}.png`, 128, 128)}
                            className={clsx(
                              "mb-1 rounded-full border-2 object-contain p-2",
                              {
                                "bg-yellow-600": m.rarity === 5,
                                "bg-purple-600": m.rarity === 4,
                                "bg-blue-600": m.rarity === 3,
                                "bg-green-600": m.rarity === 2,
                                "bg-zinc-600": m.rarity === 1,
                              }
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
                          href={`/hsr/item/${m.id}`}
                          key={m.id}
                          className="relative flex h-16 w-16 flex-row justify-center"
                          data-tooltip-id="item_tooltip"
                          data-tooltip-content={m.name}
                          data-data-tooltip-place="bottom"
                        >
                          <img
                            loading="eager"
                            src={getHsrUrl(`/items/${m.id}.png`, 128, 128)}
                            className={clsx(
                              "mb-1 rounded-full border-2 object-contain p-2",
                              {
                                "bg-yellow-600": m.rarity === 5,
                                "bg-purple-600": m.rarity === 4,
                                "bg-blue-600": m.rarity === 3,
                                "bg-green-600": m.rarity === 2,
                                "bg-zinc-600": m.rarity === 1,
                              }
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
      <Tooltip id="item_tooltip" />
    </div>
  );
};

const generateJsonLd = (
  locale: string,
  t: (props: IntlFormatProps) => string
) => {
  return `{
    "@context": "http://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/",
          "name": "Genshin-Builds.com"
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": "https://genshin-builds.com/${locale}/hsr/message",
          "name": "${t({
            id: "messages",
            defaultMessage: "Messages",
          })}"
        }
      }
    ]
  }`;
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale = "en",
}) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({ language: localeToHSRLang(locale) });
  const items = await hsrData.items();
  const item = items.find((c) => c.id === params?.id);

  if (!item) {
    return {
      notFound: true,
    };
  }
  const common = await getCommon(localeToHSRLang(locale), "hsr");

  return {
    props: {
      item,
      lngDict,
      common,
      locale,
      bgStyle: {
        image: getHsrUrlLQ(`/bg/normal-bg.webp`),
        gradient: {
          background:
            "linear-gradient(rgba(26,20,26,.6),rgb(21, 20, 26) 900px)",
        },
      },
    },
  };
};

export const getStaticPaths: GetStaticPaths = async ({ locales = [] }) => {
  const hsrData = new HSRData();
  const items = await hsrData.items({
    select: ["id"],
  });

  const paths: { params: { id: string }; locale: string }[] = [];

  for (const locale of locales) {
    items.forEach((item) => {
      paths.push({ params: { id: item.id }, locale });
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export default HSRItemPage;
