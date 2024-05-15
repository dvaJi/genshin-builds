import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import Image from "@components/wuthering-waves/Image";
import type { GearSets } from "@interfaces/wuthering-waves/gear-sets";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

type Props = {
  params: { lang: string };
};

export const dynamic = "force-static";

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const title = "Wuthering Waves Gear Sets List";
  const description =
    "A complete list of all Gear Sets and their bonuses in Wuthering Waves. This page offer most updated Gear Sets information.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/gear-sets`,
    locale: params.lang,
  });
}

export default async function Page({}: Props) {
  const data = await getRemoteData<GearSets[]>("wuthering", "gear-sets");

  return (
    <div>
      <div className="my-2">
        <h2 className="text-ww-100 text-2xl">Wuthering Waves Gear Sets</h2>
        <p>A list of all Gear Sets and their bonuses in Wuthering Waves.</p>

        <FrstAds
          placementName="genshinbuilds_billboard_atf"
          classList={["flex", "justify-center"]}
        />
        <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      </div>
      <div className="flex flex-col justify-center gap-6 rounded border border-zinc-800 bg-zinc-900 p-4">
        {data.map((item) => (
          <div key={item.id} className="flex gap-2">
            <div className="bg-ww-950 border-ww-900 flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border">
              <Image
                className=""
                src={`/icons/${item.id}.webp`}
                alt={item.name}
                width={80}
                height={80}
              />
            </div>
            <div>
              <h2 className="text-ww-100 mb-1 text-lg">{item.name} Build</h2>
              <div className="mt-2 flex flex-col gap-3">
                {item.bonus.map((bonus) => (
                  <div key={bonus.value} className="text-ww-100 text-sm">
                    <span className="bg-ww-950 border-ww-900 mr-1 rounded border p-1 text-xs">
                      {bonus.count}
                    </span>{" "}
                    {bonus.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
