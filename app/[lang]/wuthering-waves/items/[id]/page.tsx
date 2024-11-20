import { i18n } from "i18n-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { genPageMetadata } from "@app/seo";
import Stars from "@components/hsr/Stars";
import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/wuthering-waves/Image";
import type { Items } from "@interfaces/wuthering-waves/items";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";
import { getImg } from "@lib/imgUrl";
import { rarityToString } from "@utils/rarity";

type Props = {
  params: Promise<{ lang: string; id: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const { lang, id } = await params;

  const item = await getWWData<Items>({
    resource: "items",
    language: lang,
    filter: {
      id,
    },
  });

  if (!item) {
    return;
  }

  const title = `Wuthering Waves (WuWa) ${item.name} item`;
  const description = `${item.name} is an ${rarityToString(item.rarity)} (${item.rarity} ★) item in Wuthering Waves (WuWa).`;

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/items/${id}`,
    image: getImg("wuthering", `/items/${item.icon}.webp`),
    locale: lang,
  });
}

export default async function Page({ params }: Props) {
  const { lang, id } = await params;
  const item = await getWWData<Items>({
    resource: "items",
    language: lang,
    filter: {
      id,
    },
  });

  if (!item) {
    return notFound();
  }

  return (
    <div className="my-2">
      <div className="flex gap-4 px-2 lg:px-0">
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`flex-shrink-0 flex-grow-0 rarity-${item.rarity} h-[140px] w-[140px] overflow-hidden rounded-lg`}
          >
            <Image
              src={`/items/${item.icon}.webp`}
              alt={item.name}
              width={140}
              height={140}
            />
          </div>
        </div>
        <div className="">
          <h1 className="mb-2 text-3xl text-white">
            Wuthering Waves {item.name} item
          </h1>
          <div className="flex flex-col items-baseline gap-2">
            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">Type:</span>
              {item.type.name}
            </div>

            <div className="flex items-center gap-2 rounded bg-ww-900 px-2 text-sm text-ww-50">
              <span className="text-xs">Rarity:</span>
              <Stars stars={item.rarity} />
            </div>
          </div>
          <p className="mt-2 max-w-3xl rounded bg-ww-900 p-2 text-sm leading-relaxed text-ww-50 md:bg-transparent md:p-0">
            {item.desc}
          </p>
        </div>
      </div>

      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <h2 className="text-xl text-ww-100">Tags</h2>
      <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
        {item.tag.map((tag) => (
          <p
          key={tag.id}
            className="m-4 border-l-4 border-ww-700 p-2"
            dangerouslySetInnerHTML={{ __html: tag.name }}
          />
        ))}
      </div>

      <h2 className="text-xl text-ww-100">Sources</h2>
      <div className="relative z-20 mx-2 mb-2 flex flex-col rounded border border-zinc-800 bg-zinc-900 p-2 text-ww-50 lg:mx-0">
        {item.source.map((source) => (
          <p
          key={source.id}
            className="m-4 border-l-4 border-ww-700 p-2"
            dangerouslySetInnerHTML={{ __html: source.name }}
          />
        ))}
      </div>
    </div>
  );
}
