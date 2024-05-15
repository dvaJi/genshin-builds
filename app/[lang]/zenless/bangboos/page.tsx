import { i18n } from "i18n-config";
import { Metadata } from "next";
import importDynamic from "next/dynamic";
import Link from "next/link";

import Image from "@components/zenless/Image";
import type { Bangboos } from "@interfaces/zenless/bangboos";
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
  title: "Zenless Zone Zero (ZZZ) Bangboos List",
  description: "A complete list of all playable bangboos in Zenless Zone Zero.",
};

type Props = {
  params: {
    lang: string;
  };
};

export default async function BangboosPage({ params }: Props) {
  const data = await getRemoteData<Bangboos[]>("zenless", "bangboos");
  return (
    <div>
      <h1 className="text-4xl font-semibold">
        Zenless Zone Zero (ZZZ) Bangboos List
      </h1>
      <p>A complete list of all bangboos in Zenless Zone Zero.</p>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-6 flex flex-wrap items-center justify-center gap-1 md:gap-4">
        {data.map((bangboo) => (
          <Link
            key={bangboo.name}
            href={`/${params.lang}/zenless/bangboos/${bangboo.id}`}
            className="group relative items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
            prefetch={false}
          >
            <div className="flex aspect-square h-40 items-center justify-center rounded-t bg-black group-hover:bg-[#fbfe00]">
              <Image
                className="max-w-max"
                src={`/bangboos/${bangboo.id}.png`}
                alt={bangboo.name}
                width={200}
                height={200}
              />
            </div>
            <div
              className="absolute bottom-0 flex h-7 w-full items-center justify-center"
              style={{
                background:
                  "repeating-linear-gradient( -45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 3px, rgba(60,60,60,0.5) 3px, rgba(60, 60, 60,0.5) 7px )",
              }}
            >
              <h2 className="font-bold text-white">{bangboo.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
