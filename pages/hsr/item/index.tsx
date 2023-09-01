import HSRData from "hsr-data";
import type { Items } from "hsr-data/dist/types/items";
import { GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import Metadata from "@components/Metadata";

import useIntl from "@hooks/use-intl";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl, getHsrUrlLQ } from "@lib/imgUrl";
import { getLocale } from "@lib/localData";
import { localeToHSRLang } from "@utils/locale-to-lang";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

type Props = {
  items: Items[];
};

function HSRItems({ items }: Props) {
  const { t } = useIntl("items");
  return (
    <div className="bg-hsr-surface1 p-4 shadow-2xl">
      <Metadata
        pageTitle={t({
          id: "title",
          defaultMessage: "Honkai: Star Rail All Items List",
        })}
        pageDescription={t({
          id: "description",
          defaultMessage: "A complete list of all items in Honkai: Star Rail.",
        })}
      />
      <h2 className="text-3xl font-semibold uppercase text-slate-100">
        {t({
          id: "items",
          defaultMessage: "Items",
        })}
      </h2>
      <p className="px-4 text-sm">
        {t({
          id: "items_desc",
          defaultMessage:
            "Items are collectible objects from Honkai: Star Rail. Majority of the items can be accessed through the Inventory.",
        })}
      </p>
      <div className="mt-4"></div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <menu className="mx-4 mt-2 grid grid-cols-3 gap-4 md:grid-cols-4 lg:mx-0 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/hsr/item/${item.id}`}
            className="group/link grid justify-center justify-items-center bg-hsr-surface2 text-center hover:bg-hsr-accent/20"
          >
            <img
              className="h-[128px] w-[128px]"
              src={getHsrUrl(`/items/${item.id}.png`, 128, 128)}
              alt={item.name}
            />
            <h3
              className="px-1 pb-3 leading-5 group-hover/link:text-white"
              dangerouslySetInnerHTML={{ __html: item.name }}
            />
          </Link>
        ))}
      </menu>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const lngDict = await getLocale(localeToHSRLang(locale), "hsr");
  const hsrData = new HSRData({
    language: localeToHSRLang(locale),
  });
  const items = await hsrData.items({
    select: ["id", "name"],
  });

  return {
    props: {
      items,
      lngDict,
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

export default HSRItems;
