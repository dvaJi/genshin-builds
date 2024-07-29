import { i18n } from "i18n-config";
import { Metadata } from "next";
import importDynamic from "next/dynamic";

import Image from "@components/zenless/Image";
import type { DiskDrives } from "@interfaces/zenless/diskDrives";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

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
  title: "Zenless Zone Zero (ZZZ) Disk Drives List",
  description: "A list of all Disk Drives gear sets in Zenless Zone Zero",
};

export default async function BangboosPage() {
  const data = await getZenlessData<DiskDrives[]>({
    resource: "disk-drives",
  });
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
        {data?.map((drive) => (
          <div
            key={drive.name}
            className="flex gap-2 rounded-lg border-2 border-zinc-950 p-2"
          >
            <div className="flex w-[120px] min-w-[120px] flex-col items-center justify-center">
              <Image
                className="mr-2 h-12 w-12"
                src={`/disk-drives/${drive.id}.png`}
                alt={drive.name}
                width={48}
                height={48}
              />
              <h3 className="text-center font-semibold">{drive.rarity}</h3>
            </div>
            <div>
              <div className="flex">
                <h4 className="font-semibold">{drive.name}</h4>
              </div>
              <div>
                {drive.bonus.map((b) => (
                  <p key={b.value} className="py-1">
                    <span className="mr-1 rounded bg-zinc-200 px-1 text-xs">
                      {b.count}
                    </span>
                    {b.value}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
