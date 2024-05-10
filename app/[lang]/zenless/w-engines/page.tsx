import { i18n } from "i18n-config";
import { Metadata } from "next";
import importDynamic from "next/dynamic";

import Badge from "@components/ui/Badge";
import Image from "@components/zenless/Image";
import type { WEngines } from "@interfaces/zenless/wEngines";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getRemoteData } from "@lib/localData";

const Ads = importDynamic(() => import("@components/ui/Ads"), { ssr: false });
const FrstAds = importDynamic(() => import("@components/ui/FrstAds"), {
  ssr: false,
});

export const dynamic = "force-static";
export const revalidate = 43200;

export async function generateStaticParams() {
  const langs = i18n.locales;

  return langs.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Zenless Zone Zero (ZZZ) W-Engines List",
  description:
    "A list of all W-Engines weapons and their stats in Zenless Zone Zero.",
};

export default async function BangboosPage() {
  const data = await getRemoteData<WEngines[]>("zenless", "w-engines");
  return (
    <div className="relative z-0">
      <h1 className="text-4xl font-semibold">
        Zenless Zone Zero (ZZZ) Disk Drives List
      </h1>
      <p>
        A complete list of all Disk Drives and their bonus in Zenless Zone Zero.
      </p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mx-2 my-4 flex flex-col gap-2 md:mx-0">
        {data.map((engine) => (
          <div
            key={engine.name}
            className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
              <Image
                className="mr-2 h-12 w-12"
                src={`/w-engines/${engine.id}.png`}
                alt={engine.name}
                width={48}
                height={48}
              />
              <h3 className="text-center font-semibold">{engine.rarity}</h3>
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <h4 className="font-semibold">{engine.name}</h4>
              </div>
              <div className="mt-1">
                <Badge className="bg-zinc-200 font-normal">
                  Base ATK: {engine.base_atk}
                </Badge>
                <Badge className="bg-zinc-200 font-normal">
                  {engine.stat_name}: {engine.stat_value}
                </Badge>
              </div>
              <div className="pt-3 text-sm font-semibold">{engine.bonus}</div>
              <div className="py-2">{engine.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
