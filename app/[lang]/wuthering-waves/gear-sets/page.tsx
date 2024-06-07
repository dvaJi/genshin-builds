import { i18n } from "i18n-config";
import type { Metadata } from "next";
import importDynamic from "next/dynamic";

import { genPageMetadata } from "@app/seo";
import Image from "@components/wuthering-waves/Image";
import type { GearSets } from "@interfaces/wuthering-waves/gear-sets";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getWWData } from "@lib/dataApi";

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
  const title = "Wuthering Waves (WuWa) Gear Sets List";
  const description =
    "A complete list of all Gear Sets and their bonuses in Wuthering Waves (WuWa). This page offer most updated Gear Sets information.";

  return genPageMetadata({
    title,
    description,
    path: `/wuthering-waves/gear-sets`,
    locale: params.lang,
  });
}

export default async function Page({ params }: Props) {
  const data = await getWWData<GearSets[]>({
    resource: "gears",
    language: params.lang,
    select: ["id", "name", "bonus"],
  });

  return (
    <div>
      <div className="my-2">
        <h2 className="text-2xl text-ww-100">Wuthering Waves Gear Sets</h2>
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
            <div className="flex flex-shrink-0 flex-grow-0 items-center justify-center overflow-hidden rounded border border-ww-900 bg-ww-950">
              <Image
                className=""
                src={`/icons/${item.id}.webp`}
                alt={item.name}
                width={80}
                height={80}
              />
            </div>
            <div>
              <h2 className="mb-1 text-lg text-ww-100">{item.name} Build</h2>
              <div className="mt-2 flex flex-col gap-3">
                {item.bonus.map((bonus) => (
                  <div key={bonus.value} className="text-sm text-ww-100">
                    <span className="mr-1 rounded border border-ww-900 bg-ww-950 p-1 text-xs">
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
