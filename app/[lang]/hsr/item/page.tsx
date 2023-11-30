import type { Items } from "hsr-data/dist/types/items";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import { genPageMetadata } from "@app/seo";
import useTranslations from "@hooks/use-translations";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getHSRData } from "@lib/dataApi";
import { getHsrUrl } from "@lib/imgUrl";
import { i18n } from "i18n-config";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

type Props = {
  params: { lang: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, locale } = await useTranslations(params.lang, "hsr", "items");
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

export default async function HSRItemPage({ params }: Props) {
  const { t, langData } = await useTranslations(params.lang, "hsr", "items");

  const items = await getHSRData<Items[]>({
    resource: "items",
    language: langData,
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
            href={`/${params.lang}/hsr/item/${item.id}`}
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
