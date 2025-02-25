import { i18n } from "i18n-config";
import { Metadata } from "next";
import Link from "next/link";

import Ads from "@components/ui/Ads";
import FrstAds from "@components/ui/FrstAds";
import Image from "@components/zenless/Image";
import type { Bangboos } from "@interfaces/zenless/bangboos";
import { AD_ARTICLE_SLOT } from "@lib/constants";
import { getZenlessData } from "@lib/dataApi";

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
  params: Promise<{
    lang: string;
  }>;
};

export default async function BangboosPage({ params }: Props) {
  const { lang } = await params;
  const data = await getZenlessData<Bangboos[]>({
    resource: "bangboos",
    language: lang,
    select: ["id", "name", "icon"],
  });
  return (
    <div className="px-4 md:px-0">
      <div className="my-4 md:my-6">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Zenless Zone Zero (ZZZ) Bangboos List
        </h1>
        <p className="text-sm md:text-base text-neutral-200">A complete list of all bangboos in Zenless Zone Zero.</p>
      </div>
      <FrstAds
        placementName="genshinbuilds_billboard_atf"
        classList={["flex", "justify-center"]}
      />
      <Ads className="mx-auto my-0" adSlot={AD_ARTICLE_SLOT} />
      <div className="mt-4 md:mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {data?.map((bangboo) => (
          <Link
            key={bangboo.name}
            href={`/${lang}/zenless/bangboos/${bangboo.id}`}
            className="group relative items-center justify-center overflow-hidden rounded-lg border-2 border-zinc-950 text-center ring-[#fbfe00] transition-all hover:scale-105 hover:ring-8"
            prefetch={false}
          >
            <div className="flex aspect-square h-auto md:h-40 items-center justify-center rounded-t bg-black group-hover:bg-[#fbfe00]">
              <Image
                className="max-w-max"
                src={`/bangboos/${bangboo.icon}.webp`}
                alt={bangboo.name}
                width={200}
                height={200}
              />
            </div>
            <div
              className="absolute bottom-0 flex h-6 md:h-7 w-full items-center justify-center"
              style={{
                background:
                  "repeating-linear-gradient( -45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5) 3px, rgba(60,60,60,0.5) 3px, rgba(60, 60, 60,0.5) 7px )",
              }}
            >
              <h2 className="text-sm md:text-base font-bold text-white truncate px-2">{bangboo.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
