import HSRData from "hsr-data";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHsrUrl } from "@lib/imgUrl";

const Ads = dynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = dynamic(() => import("@components/ui/FrstAds"), { ssr: false });

export async function generateMetadata(): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations("hsr", "items");
  const title = t({
    id: "title",
    defaultMessage: "Honkai: Star Rail All Items List",
  });
  const description = t({
    id: "description",
    defaultMessage: "A complete list of all items in Honkai: Star Rail.",
  });

  return genPageMetadata({
    title,
    description,
    path: `/hsr/item`,
    locale,
  });
}

export default async function Page() {
  const { t, language } = await useTranslations("hsr", "items");

  const hsrData = new HSRData({
    language: language as any,
  });
  const items = await hsrData.items({
    select: ["id", "name"],
  });

  return (
    <div>
      <div className="my-2">
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

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
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
